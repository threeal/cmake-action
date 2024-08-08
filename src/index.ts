import { error, setOutput } from "gha-utils";
import { buildProject, configureProject } from "./cmake.js";
import { getContext } from "./context.js";

try {
  const context = getContext();

  configureProject(context);

  setOutput("build-dir", context.buildDir);

  if (context.build.enabled) {
    buildProject(context);
  }
} catch (err) {
  error(err);
  process.exit(1);
}
