import { getErrorMessage } from "catched-error-message";
import fs from "node:fs";
import os from "node:os";
import { buildProject, configureProject } from "./cmake.js";
import { getContext } from "./context.js";

try {
  const context = getContext();

  configureProject(context);

  fs.appendFileSync(
    process.env["GITHUB_OUTPUT"] as string,
    `build-dir=${context.buildDir}${os.EOL}`,
  );

  if (context.runBuild) {
    buildProject(context);
  }
} catch (err) {
  process.exitCode = 1;
  process.stdout.write(`::error::${getErrorMessage(err)}${os.EOL}`);
}
