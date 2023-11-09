import { Command } from "commander";
import { config } from "../../config/config.ts";
import { _, axios } from "../../deps.ts";
import * as builder from "../interfaces.ts";
import { jenkins } from "../jenkins.ts";
import * as parameters from "../parameters.ts";
import { buildCommandName, xmlToJson } from "../utils.ts";
interface IExportConfigOpts {
  folder: string;
  cache: boolean;
  all: boolean;
}

export default function (program: Command) {
  program
    .command(buildCommandName(new URL("", import.meta.url).pathname))
    .option("--folder <folder>", "jenkins folder")
    .option("--cache", "use config from cache")
    .option("--all", "get all configuration without specific folder")
    .action(async (opts: IExportConfigOpts) => {
      if (_.isEmpty(opts)) {
        console.error(
          "Error: You must provide some flag option. like --folder"
        );
        program.help();
      }

      try {
        console.log("pending...");
        return await exportConfig(opts);
      } catch (err) {
        console.error(err);
      }
    });
}

async function getAllJobPaths(folder: string, jobPaths: string[] = []): Promise<string[]> {
  try {
    const data = await jenkins.job.get({ name: folder });
    if (data.jobs) {
      for (const subJob of data.jobs) {
        if (subJob._class === "com.cloudbees.hudson.plugins.folder.Folder") {
          // console.log(`Folder: ${subJob.name}`);
          await getAllJobPaths(`${folder}/${subJob.name}`, jobPaths);
        } else {
          console.log(`Job: ${folder}/${subJob.name}`);
          const fullPath = `${folder}/${subJob.name}`;

          const filteredWords = !(
            fullPath.includes("__DSL__") ||
            fullPath.includes("__factory") ||
            fullPath.includes("__dso_tools")
          );

          if (filteredWords) jobPaths.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return jobPaths;
}

export interface IParameter {
  class: string;
  type: string | undefined;
  configs: (
    | builder.IBooleanParam
    | builder.IChoiceParam
    | builder.IStringParam
    | builder.ICascadeChoiceParameter
    | builder.IChoiceParameter
    | builder.ICredentials
    | builder.IExtendedChoice
    | builder.IFileParam
    | builder.IGitParameter
    | builder.IPasswordParameterDefinition
    | builder.IPersistentChoiceParam
    | builder.IPersistentStringParam
    | builder.IPersistentTextParam
    | builder.ISeparator
    | builder.IStashedFile
    | builder.ITextParam
    | builder.IValidatingString
    | builder.IWHideParameterDefinition
    | builder.IWReadonlyStringParameterDefinition
    | builder.IWReadonlyTextParameterDefinition
  )[];
}

interface IPipeline {
  name: string;
  parameters: IParameter[];
}

interface IJob {
  root: string;
  pipelines: IPipeline[];
}

interface IJSONSchema {
  jobs: IJob;
}

async function exportConfig(opts: IExportConfigOpts) {
  let data: string[];
  const tmpFolder = "tmp";
  const outputPath = `${tmpFolder}/${opts.folder}-job-paths.json`;
  const outputParams = `${tmpFolder}/dsl-params.json`;
  let resultObject: { [x: string]: string } = {};

  await Deno.mkdir(tmpFolder, { recursive: true });

  if (!opts.cache) {
    data = await getAllJobPaths(opts.folder);
    await Deno.writeTextFile(outputPath, JSON.stringify(data, null, 4));

    const apiData = await axios.get(
      `${config.jenkins.url}/job-dsl-api-viewer/data`,
      {
        headers: {
          "x-awesome-devops-token-x": config.jenkins.token,
        },
      }
    );
    const jsonDsl =
      apiData.data.contexts[
        "javaposse.jobdsl.dsl.helpers.BuildParametersContext"
      ];
    const outputDsl = `${tmpFolder}/dsl-data.json`;
    await Deno.writeTextFile(outputDsl, JSON.stringify(jsonDsl, null, 4));

    const jsonObject: { [x: string]: string } = {};
    await jsonDsl.methods.forEach(
      (method: { signatures: { contextClass: string }[]; name: string }) => {
        method.signatures.forEach((signature) => {
          jsonObject[method.name] = signature.contextClass;
        });
      }
    );

    resultObject = _.omitBy(jsonObject, (value, key) => {
      return _.some(jsonObject, (otherValue, otherKey) => {
        return (
          key !== otherKey && value === otherValue && !key.endsWith("Param")
        );
      });
    });

    resultObject.separator =
      "jenkins.plugins.parameter__separator.ParameterSeparatorDefinition";
    resultObject.validatingString =
      "hudson.plugins.validating__string__parameter.ValidatingStringParameterDefinition";
    resultObject.extendedChoice =
      "com.cwctravel.hudson.plugins.extended__choice__parameter.ExtendedChoiceParameterDefinition";
    resultObject.passwordParameterDefinitionV2 = "hudson.model.PasswordParameterDefinition";

    await Deno.writeTextFile(
      outputParams,
      JSON.stringify(resultObject, null, 4)
    );
  } else {
    data = JSON.parse(await Deno.readTextFile(outputPath));
    resultObject = JSON.parse(await Deno.readTextFile(outputParams));
  }

  const jsonSchema: IJSONSchema = {
    jobs: {
      root: "",
      pipelines: [],
    },
  };

  data.forEach(async (name) => {
    const xmlConfig = await jenkins.job.config({ name: name });
    const jsonConfig = xmlToJson(xmlConfig);

    let parameterDefinitions = {};
    if (_.get(jsonConfig, ["flow-definition"])) {
      parameterDefinitions = await _.get(jsonConfig, [
        "flow-definition",
        "properties",
        "hudson.model.ParametersDefinitionProperty",
        "parameterDefinitions",
      ]);
    } else if (_.get(jsonConfig, ["project"])) {
      parameterDefinitions = await _.get(jsonConfig, [
        "project",
        "properties",
        "hudson.model.ParametersDefinitionProperty",
        "parameterDefinitions",
      ]);
    }

    if (parameterDefinitions) {
      // console.log(parameterDefinitions["hudson.model.PasswordParameterDefinition"]);
      // console.log(resultObject);

      const parameterKeys = Object.keys(parameterDefinitions); // class ในแต่ละ pipline
      // const resultValues = Object.values(resultObject); // dsl ที่มีทั้งหมด
      const pipelineArray: IParameter[] = [];

      parameterKeys.forEach((key) => {
        type BuilderFunctions = {
          [key: string]: {
            type: string,
            parameterFunction :(
              // deno-lint-ignore no-explicit-any
              parameterDefinitions: any,
              key: string,
              parameterObject: IParameter
            ) => IParameter;
          }
        };

        const builderFunctions: BuilderFunctions = {
          "hudson.model.BooleanParameterDefinition": {
            type: "boolean",
            parameterFunction: parameters.booleanParam,
          },
          "net.uaznia.lukanus.hudson.plugins.gitparameter.GitParameterDefinition": {
            type: "text",
            parameterFunction: parameters.gitParameter,
          },
          "com.wangyin.parameter.WHideParameterDefinition": {
            type: "text",
            parameterFunction: parameters.wHideParameterDefinition,
          },
          "com.wangyin.ams.cms.abs.ParaReadOnly.WReadonlyStringParameterDefinition": {
            type: "text",
            parameterFunction: parameters.wReadonlyStringParameterDefinition
          },
          "com.wangyin.ams.cms.abs.ParaReadOnly.WReadonlyTextParameterDefinition": {
            type: "text",
            parameterFunction: parameters.wReadonlyTextParameterDefinition,
          },
          "com.gem.persistentparameter.PersistentStringParameterDefinition": {
            type: "text",
            parameterFunction: parameters.persistentStringParam,
          },
          "jenkins.plugins.parameter__separator.ParameterSeparatorDefinition": {
            type: "separator",
            parameterFunction: parameters.separator,
          },
          "hudson.model.ChoiceParameterDefinition": {
            type: "choice",
            parameterFunction: parameters.choiceParam,
          },
          "com.gem.persistentparameter.PersistentChoiceParameterDefinition": {
            type: "choice",
            parameterFunction: parameters.persistentChoiceParam,
          },
          "org.biouno.unochoice.ChoiceParameter": {
            type: "text",
            parameterFunction: parameters.choiceParameter,
          },
          "hudson.model.StringParameterDefinition": {
            type: "text",
            parameterFunction: parameters.stringParam,
          },
          "com.cloudbees.plugins.credentials.CredentialsParameterDefinition": {
            type: "credentials",
            parameterFunction: parameters.credentials,
          },
          "org.biouno.unochoice.CascadeChoiceParameter": {
            type: "text",
            parameterFunction: parameters.cascadeChoiceParameter,
          },
          "hudson.plugins.validating__string__parameter.ValidatingStringParameterDefinition": {
            type: "text",
            parameterFunction: parameters.validatingString,
          },
          "hudson.model.TextParameterDefinition": {
            type: "text",
            parameterFunction: parameters.textParam,
          },
          "com.gem.persistentparameter.PersistentTextParameterDefinition": {
            type: "text",
            parameterFunction: parameters.persistentTextParam,
          },
          "hudson.model.FileParameterDefinition": {
            type: "file",
            parameterFunction: parameters.fileParam,
          },
          "com.michelin.cio.hudson.plugins.passwordparam.PasswordParameterDefinition": {
            type: "password",
            parameterFunction: parameters.passwordParameterDefinition,
          },
          "com.cwctravel.hudson.plugins.extended__choice__parameter.ExtendedChoiceParameterDefinition": {
            type: "text",
            parameterFunction: parameters.extendedChoice,
          },
          "io.jenkins.plugins.file_parameters.StashedFileParameterDefinition": {
            type: "file",
            parameterFunction: parameters.stashedFile,
          }
        };

        const builderFunction = builderFunctions[key];
        if (builderFunction) {
          let parameterObject: IParameter = {
            class: key,
            type: builderFunction.type,
            configs: [],
          };

          parameterObject = builderFunction.parameterFunction(
            parameterDefinitions,
            key,
            parameterObject
          );

          pipelineArray.push(parameterObject);
        } else {
          console.error("No builder function defined for key " + key);
        }
      });

      const pipelineObject = {
        name: name,
        parameters: pipelineArray,
      };

      jsonSchema.jobs.pipelines.push(pipelineObject);
      if (opts.folder) {
        jsonSchema.jobs.root = opts.folder;
      }
    } else {
      const pipelineArray: IParameter[] = [];

      const pipelineObject = {
        name: name,
        parameters: pipelineArray,
      };

      jsonSchema.jobs.pipelines.push(pipelineObject);
      if (opts.folder) {
        jsonSchema.jobs.root = opts.folder;
      }
      // console.log(`Job ${name} no have been created with parameters.`);
    }

    const output = `${tmpFolder}/data.json`;
    await Deno.writeTextFile(output, JSON.stringify(jsonSchema, null, 4));
  });
}
