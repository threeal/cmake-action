import { logError, setOutput } from "gha-utils";
import { buildProject, configureProject } from "./cmake.js";
import { getContext } from "./context.js";

try {
  const context = getContext();

  await configureProject(context);

  await setOutput("build-dir", context.buildDir);

  if (context.build.enabled) {
    await buildProject(context);
  }
} catch (err) {
  logError(err);
  process.exit(1);
}
