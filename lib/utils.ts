import Path from "node:path";
import { _, json2yaml, xml2js } from "../deps.ts";

export function buildCommandName(__filename: string, extra = "") {
  const commandName = _.kebabCase(Path.basename(__filename, ".ts"));
  return `${commandName} ${extra}`.trim();
}

export function xmlToJson(data: string): string {
  const obj = xml2js(data, {
    compact: true,
  });
  const prettyJsonString = JSON.stringify(obj, null, 4);
  const formattedData = JSON.parse(prettyJsonString);
  // console.log(prettyJsonString)
  return formattedData;
}

export function jsonToYaml(data: string): string {
  const jsonString = JSON.stringify(data);
  const yamlString = json2yaml(jsonString);
  return yamlString
}