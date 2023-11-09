import * as builder from "./interfaces.ts";
import { IParameter } from "./programs/export-config.ts";

function processParameter<T>(
  parameterDefinitions: any,
  key: string,
  parameterObject: IParameter,
  typeConstructor: (item: any) => T
): IParameter {
  const items = Array.isArray(parameterDefinitions[key])
    ? parameterDefinitions[key]
    : [parameterDefinitions[key]];

  for (const item of items) {
    const data = typeConstructor(item) as
      | builder.IBooleanParam
      | builder.IGitParameter
      | builder.IWHideParameterDefinition
      | builder.IWReadonlyStringParameterDefinition
      | builder.IWReadonlyTextParameterDefinition
      | builder.IPersistentStringParam
      | builder.ISeparator
      | builder.IChoiceParam
      | builder.IChoiceParameter
      | builder.IStringParam
      | builder.ICredentials
      | builder.ICascadeChoiceParameter
      | builder.IValidatingString
      | builder.ITextParam
      | builder.IPersistentTextParam
      | builder.IFileParam
      | builder.IPasswordParameterDefinition
      | builder.IExtendedChoice
      | builder.IStashedFile
      | builder.IPersistentBooleanParam;
      
    parameterObject.configs.push(data);
  }

  return parameterObject;
}

export function booleanParam(
  parameterDefinitions: builder.IBooleanParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text === "true",
      description: item.description?._text || "",
    })
  );
}

export function gitParameter(
  parameterDefinitions: builder.IGitParameter,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      type: item.type?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
      branch: item.branch?._text || "",
      branchFilter: item.branchFilter?._text || "",
      tagFilter: item.tagFilter?._text || "",
      sortMode: item.sortMode?._text || "",
      selectedValue: item.selectedValue?._text || "",
      useRepository: item.useRepository?._text || "",
      quickFilterEnabled: item.quickFilterEnabled?._text === "true",
      listSize: item.listSize?._text || "",
      requiredParameter: item.requiredParameter?._text === "true",
    })
  );
}

export function wHideParameterDefinition(
  parameterDefinitions: builder.IWHideParameterDefinition,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function wReadonlyStringParameterDefinition(
  parameterDefinitions: builder.IWReadonlyStringParameterDefinition,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function wReadonlyTextParameterDefinition(
  parameterDefinitions: builder.IWReadonlyTextParameterDefinition,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function persistentStringParam(
  parameterDefinitions: builder.IPersistentStringParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      successfulOnly: item.successfulOnly._text === "true",
      description: item.description?._text || "",
      trim: item.trim?._text === "true",
    })
  );
}

export function separator(
  parameterDefinitions: builder.ISeparator,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      separatorStyle: item.separatorStyle?._text || "",
      sectionHeader: item.sectionHeader?._text || "",
      sectionHeaderStyle: item.sectionHeaderStyle?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function choiceParam(
  parameterDefinitions: builder.IChoiceParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => {
      if (item.choices._attributes?.class === "java.util.Arrays$ArrayList") {
        const choices = Array.isArray(item.choices.a.string)
          ? item.choices.a.string.map(
              (choice: { _text: string }) => choice._text
            )
          : [item.choices.a.string._text];
        return {
          name: item.name?._text || "",
          description: item.description?._text || "",
          choices: choices,
        };
      } else {
        const choices = Array.isArray(item.choices.string)
          ? item.choices.string.map((choice: { _text: string }) => choice._text)
          : [item.choices.string._text];
        return {
          name: item.name?._text || "",
          description: item.description?._text || "",
          choices: choices,
        };
      }
    }
  );
}

export function persistentChoiceParam(
  parameterDefinitions: builder.IPersistentChoiceParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => {
      const choices = Array.isArray(item.choices.string)
        ? item.choices.string.map((choice: { _text: string }) => choice._text)
        : [item.choices.string._text];
      return {
        name: item.name?._text || "",
        description: item.description?._text || "",
        successfulOnly: item.successfulOnly?._text === "true",
        choices: choices,
      };
    }
  );
}

export function choiceParameter(
  parameterDefinitions: builder.IChoiceParameter,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => {
      const classpathEntries =
        item.script?.secureScript?.classpath?.classpathEntry || [];
      const fallbackClasspathEntries =
        item.script?.secureFallbackScript?.classpath?.classpathEntry || [];

      return {
        name: item.name?._text || "",
        description: item.description?._text || "",
        randomName: item.randomName?._text || "",
        choiceType: item.choiceType?._text || "",
        filterable: item.filterable?._text === "true",
        filterLength: parseInt(item.filterLength?._text || "0"),
        script: {
          groovyScript: {
            script: item.script?.secureScript?.script?._text || "",
            sandbox: item.script?.secureScript?.sandbox?._text === "true",
            classpath: {
              classpathEntry: classpathEntries.map(
                (entry: {
                  path: string;
                  oldPath: string;
                  shouldBeApproved: boolean;
                }) => ({
                  path: entry.path || "",
                  oldPath: entry.oldPath || "",
                  shouldBeApproved: entry.shouldBeApproved || false,
                })
              ),
            },
            fallbackScript: {
              script: item.script?.secureFallbackScript?.script?._text || "",
              sandbox:
                item.script?.secureFallbackScript?.sandbox?._text === "true",
              classpath: {
                classpathEntry: fallbackClasspathEntries.map(
                  (entry: {
                    path: string;
                    oldPath: string;
                    shouldBeApproved: string;
                  }) => ({
                    path: entry.path || "",
                    oldPath: entry.oldPath || "",
                    shouldBeApproved: entry.shouldBeApproved || false,
                  })
                ),
              },
            },
          },
        },
      };
    }
  );
}

export function stringParam(
  parameterDefinitions: builder.IStringParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
      trim: item.trim?._text === "true",
    })
  );
}

export function credentials(
  parameterDefinitions: builder.ICredentials,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
      credentialType: item.credentialType?._text || "",
      required: item.required?._text === "true",
    })
  );
}

export function cascadeChoiceParameter(
  parameterDefinitions: builder.ICascadeChoiceParameter,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => {
      const classpathEntries =
        item.script?.secureScript?.classpath?.classpathEntry || [];
      const fallbackClasspathEntries =
        item.script?.secureFallbackScript?.classpath?.classpathEntry || [];

      return {
        name: item.name?._text || "",
        description: item.description?._text || "",
        randomName: item.randomName?._text || "",
        choiceType: item.choiceType?._text || "",
        referencedParameters: item.referencedParameters?._text || "",
        filterable: item.filterable?._text === "true",
        filterLength: parseInt(item.filterLength?._text || "0"),
        script: {
          groovyScript: {
            script: item.script?.secureScript?.script?._text || "",
            sandbox: item.script?.secureScript?.sandbox?._text === "true",
            classpath: {
              classpathEntry: classpathEntries.map(
                (entry: {
                  path: string;
                  oldPath: string;
                  shouldBeApproved: boolean;
                }) => ({
                  path: entry.path || "",
                  oldPath: entry.oldPath || "",
                  shouldBeApproved: entry.shouldBeApproved || false,
                })
              ),
            },
            fallbackScript: {
              script: item.script?.secureFallbackScript?.script?._text || "",
              sandbox:
                item.script?.secureFallbackScript?.sandbox?._text === "true",
              classpath: {
                classpathEntry: fallbackClasspathEntries.map(
                  (entry: {
                    path: string;
                    oldPath: string;
                    shouldBeApproved: string;
                  }) => ({
                    path: entry.path || "",
                    oldPath: entry.oldPath || "",
                    shouldBeApproved: entry.shouldBeApproved || false,
                  })
                ),
              },
            },
          },
        },
      };
    }
  );
}

export function validatingString(
  parameterDefinitions: builder.IValidatingString,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      regex: item.regex?._text || "",
      failedValidationMessage: item.failedValidationMessage?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function textParam(
  parameterDefinitions: builder.ITextParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
      trim: item.trim?._text === "true",
    })
  );
}

export function persistentTextParam(
  parameterDefinitions: builder.IPersistentTextParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      defaultValue: item.defaultValue?._text || "",
      description: item.description?._text || "",
      successfulOnly: item.successfulOnly?._text === "true",
    })
  );
}

export function fileParam(
  parameterDefinitions: builder.IFileParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function passwordParameterDefinition(
  parameterDefinitions: builder.IPasswordParameterDefinition,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function extendedChoice(
  parameterDefinitions: builder.IExtendedChoice,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      type: item.type?._text || "",
      value: item.value?._text || "",
      projectName: item.projectName?._text || "",
      propertyFile: item.propertyFile?._text || "",
      groovyScript: item.groovyScript?._text || "",
      groovyScriptFile: item.groovyScriptFile?._text || "",
      bindings: item.bindings?._text || "",
      groovyClasspath: item.groovyClasspath?._text || "",
      propertyKey: item.propertyKey?._text || "",
      defaultValue: item.defaultValue?._text || "",
      defaultPropertyFile: item.defaultPropertyFile?._text || "",
      defaultGroovyScript: item.defaultGroovyScript?._text || "",
      defaultGroovyScriptFile: item.defaultGroovyScriptFile?._text || "",
      defaultBindings: item.defaultBindings?._text || "",
      defaultGroovyClasspath: item.defaultGroovyClasspath?._text || "",
      defaultPropertyKey: item.defaultPropertyKey?._text || "",
      descriptionPropertyValue: item.descriptionPropertyValue?._text || "",
      descriptionPropertyFile: item.descriptionPropertyFile?._text || "",
      descriptionGroovyScript: item.descriptionGroovyScript?._text || "",
      descriptionGroovyScriptFile:
        item.descriptionGroovyScriptFile?._text || "",
      descriptionBindings: item.descriptionBindings?._text || "",
      descriptionGroovyClasspath: item.descriptionGroovyClasspath?._text || "",
      descriptionPropertyKey: item.descriptionPropertyKey?._text || "",
      javascriptFile: item.javascriptFile?._text || "",
      javascript: item.javascript?._text || "",
      saveJSONParameterToFile: item.saveJSONParameterToFile?._text === "true",
      quoteValue: item.quoteValue?._text === "true",
      visibleItemCount: parseInt(item.visibleItemCount?._text || "0"),
      description: item.description?._text || "",
      multiSelectDelimiter: item.multiSelectDelimiter?._text || "",
    })
  );
}

export function stashedFile(
  parameterDefinitions: builder.IStashedFile,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      description: item.description?._text || "",
    })
  );
}

export function persistentBooleanParam(
  parameterDefinitions: builder.IPersistentBooleanParam,
  key: string,
  parameterObject: IParameter
): IParameter {
  return processParameter(
    parameterDefinitions,
    key,
    parameterObject,
    (item) => ({
      name: item.name?._text || "",
      description: item.description?._text || "",
      defaultValue: item.defaultValue?._text === "true",
      successfulOnly: item.successfulOnly?._text === "true",
    })
  );
}

// const data: IPersistentBooleanParam = {
//   name: "",
//   defaultValue: false,
//   successfulOnly: false,
//   description: ""
// }
