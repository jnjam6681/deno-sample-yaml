
export interface IBooleanParam {
  name: string;
  defaultValue: boolean;
  description: string;
}

export interface IChoiceParam {
  name: string;
  description: string;
  choices: [];
}

export interface IGroovy {
  groovyScript: {
    script: string;
    sandbox: boolean;
    classpath: {
      classpathEntry: {
        path: string;
        oldPath: string;
        shouldBeApproved: boolean;
      }[];
    };
    fallbackScript: {
      script: string;
      sandbox: boolean;
      classpath: {
        classpathEntry: {
          path: string;
          oldPath: string;
          shouldBeApproved: boolean;
        }[];
      };
    };
  };
}
export interface ICascadeChoiceParameter {
  name: string;
  description: string;
  randomName: string;
  choiceType: string;
  referencedParameters: string;
  filterable: boolean;
  filterLength: number;
  script: IGroovy;
}

export interface IChoiceParameter {
  name: string;
  description: string;
  randomName: string;
  choiceType: string;
  filterable: boolean;
  filterLength: number;
  script: IGroovy;
}

export interface ICredentials {
  name: string;
  description: string;
  defaultValue: string;
  credentialType: string;
  required: boolean;
}

export interface IStringParam {
  name: string;
  defaultValue: string;
  description: string;
  trim: boolean;
}

export interface IExtendedChoice {
  name: string;
  type: string;
  value: string;
  projectName: string;
  propertyFile: string;
  groovyScript: string;
  groovyScriptFile: string;
  bindings: string;
  groovyClasspath: string;
  propertyKey: string;
  defaultValue: string;
  defaultPropertyFile: string;
  defaultGroovyScript: string;
  defaultGroovyScriptFile: string;
  defaultBindings: string;
  defaultGroovyClasspath: string;
  defaultPropertyKey: string;
  descriptionPropertyValue: string;
  descriptionPropertyFile: string;
  descriptionGroovyScript: string;
  descriptionGroovyScriptFile: string;
  descriptionBindings: string;
  descriptionGroovyClasspath: string;
  descriptionPropertyKey: string;
  javascriptFile: string;
  javascript: string;
  saveJSONParameterToFile: boolean;
  quoteValue: boolean;
  visibleItemCount: number;
  description: string;
  multiSelectDelimiter: string;
}

export interface IFileParam {
  name: string;
  description: string;
}

export interface IGitParameter {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  branch: string;
  branchFilter: string;
  tagFilter: string;
  sortMode: string;
  selectedValue: string;
  useRepository: string;
  quickFilterEnabled: boolean;
  listSize: string;
  requiredParameter: boolean;
}

export interface IPasswordParameterDefinition {
  name: string;
  description: string;
}

export interface IPersistentBooleanParam {
  name: string;
  defaultValue: boolean;
  successfulOnly: boolean;
  description: string;
}

export interface IPersistentChoiceParam {
  name: string;
  description: string;
  choices: [];
  successfulOnly: boolean;
}

export interface IPersistentStringParam {
  name: string;
  defaultValue: string;
  successfulOnly: boolean;
  description: string;
  trim: boolean;
}

export interface IPersistentTextParam {
  name: string;
  defaultValue: string;
  description: string;
  successfulOnly: boolean;
}

export interface ISeparator {
  name: string;
  separatorStyle: string;
  sectionHeader: string;
  sectionHeaderStyle: string;
  description: string;
}

export interface IStashedFile {
  name: string;
  description: string;
}

export interface ITextParam {
  name: string;
  defaultValue: string;
  description: string;
  trim: boolean;
}

export interface IValidatingString {
  name: string;
  defaultValue: string;
  regex: string;
  failedValidationMessage: string;
  description: string;
}

export interface IWHideParameterDefinition {
  name: string;
  defaultValue: string;
  description: string;
}

export interface IWReadonlyStringParameterDefinition {
  name: string;
  defaultValue: string;
  description: string;
}

export interface IWReadonlyTextParameterDefinition {
  name: string;
  defaultValue: string;
  description: string;
}
