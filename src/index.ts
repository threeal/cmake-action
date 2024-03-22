import * as core from "@actions/core";
import { exec } from "@actions/exec";
import { configureProject } from "./cmake.js";
import { getInputs } from "./inputs.js";

async function main() {
  const inputs = getInputs();

  await configureProject(inputs);

  core.setOutput("build-dir", inputs.buildDir);

  if (inputs.runBuild) {
    await exec("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs]);
  }
}

main().catch((err) => core.setFailed(err));
