import * as core from "@actions/core";
import { getErrorMessage } from "catched-error-message";
import fs from "node:fs";
import os from "node:os";
import { buildProject, configureProject } from "./cmake.js";
import { getInputs } from "./inputs.js";

try {
  const inputs = getInputs();

  configureProject(inputs);

  fs.appendFileSync(
    process.env["GITHUB_OUTPUT"] as string,
    `build-dir=${inputs.buildDir}${os.EOL}`,
  );

  if (inputs.runBuild) {
    buildProject(inputs);
  }
} catch (err) {
  core.setFailed(getErrorMessage(err));
}
