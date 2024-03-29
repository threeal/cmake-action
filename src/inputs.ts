import { getBooleanInput, getInput, getMultilineInput } from "@actions/core";
import path from "node:path";

export interface Inputs {
  sourceDir: string;
  buildDir: string;
  generator: string;
  cCompiler: string;
  cxxCompiler: string;
  cFlags: string;
  cxxFlags: string;
  options: string[];
  args: string[];
  runBuild: boolean;
  buildArgs: string[];
}

export function getInputs(): Inputs {
  const sourceDir = getInput("source-dir");
  return {
    sourceDir,
    buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
    generator: getInput("generator"),
    cCompiler: getInput("c-compiler"),
    cxxCompiler: getInput("cxx-compiler"),
    cFlags: getMultilineInput("c-flags").join(" "),
    cxxFlags: getMultilineInput("cxx-flags").join(" "),
    options: getMultilineInput("options").flatMap((opts) => opts.split(" ")),
    args: getMultilineInput("args").flatMap((args) => args.split(" ")),
    runBuild: getBooleanInput("run-build"),
    buildArgs: getMultilineInput("build-args").flatMap((args) =>
      args.split(" "),
    ),
  };
}
