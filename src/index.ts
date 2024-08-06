import * as core from "@actions/core";
import { buildProject, configureProject } from "./cmake.js";
import { getInputs } from "./inputs.js";

try {
  const inputs = getInputs();

  configureProject(inputs);

  core.setOutput("build-dir", inputs.buildDir);

  if (inputs.runBuild) {
    buildProject(inputs);
  }
} catch (err) {
  core.setFailed(err);
}
