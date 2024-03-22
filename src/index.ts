import * as core from "@actions/core";
import { exec } from "@actions/exec";
import { getInputs } from "./inputs.js";

async function main() {
  const inputs = getInputs();

  const configureArgs = [inputs.sourceDir, "-B", inputs.buildDir];

  if (inputs.generator) {
    configureArgs.push(...["-G", inputs.generator]);
  }

  if (inputs.cCompiler) {
    configureArgs.push("-DCMAKE_C_COMPILER=" + inputs.cCompiler);
  }

  if (inputs.cxxCompiler) {
    configureArgs.push("-DCMAKE_CXX_COMPILER=" + inputs.cxxCompiler);
  }

  if (inputs.cFlags) {
    configureArgs.push("-DCMAKE_C_FLAGS=" + inputs.cFlags);
  }

  if (inputs.cxxFlags) {
    configureArgs.push("-DCMAKE_CXX_FLAGS=" + inputs.cxxFlags);
  }

  configureArgs.push(...inputs.options.map((opt) => "-D" + opt));
  configureArgs.push(...inputs.args);

  await exec("cmake", configureArgs);
  core.setOutput("build-dir", inputs.buildDir);

  if (inputs.runBuild) {
    await exec("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs]);
  }
}

main().catch((err) => core.setFailed(err));
