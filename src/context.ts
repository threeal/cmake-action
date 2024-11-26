import { getInput } from "gha-utils";
import path from "node:path";
import { parse } from "./utils.js";

export interface Context {
  sourceDir: string;
  buildDir: string;
  configure: {
    generator: string;
    options: string[];
    args: string[];
  };
  build: {
    enabled: boolean;
    args: string[];
  };
}

export function getContext(): Context {
  const sourceDir = getInput("source-dir");
  const options: string[] = [];

  let input = getInput("c-compiler");
  if (input) options.push(`CMAKE_C_COMPILER=${input}`);

  input = getInput("cxx-compiler");
  if (input) options.push(`CMAKE_CXX_COMPILER=${input}`);

  input = getInput("c-flags");
  if (input) {
    const flags = input.replaceAll(/\s+/g, " ");
    options.push(`CMAKE_C_FLAGS=${flags}`);
  }

  input = getInput("cxx-flags");
  if (input) {
    const flags = input.replaceAll(/\s+/g, " ");
    options.push(`CMAKE_CXX_FLAGS=${flags}`);
  }

  input = getInput("options");
  if (input) {
    options.push(...parse(input).map((opt) => opt.toString()));
  }

  return {
    sourceDir,
    buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
    configure: {
      generator: getInput("generator"),
      options,
      args: parse(getInput("args")).map((arg) => arg.toString()),
    },
    build: {
      enabled: getInput("run-build") == "true",
      args: parse(getInput("build-args")).map((arg) => arg.toString()),
    },
  };
}
