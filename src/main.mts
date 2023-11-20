import core from "@actions/core";
import exec from "@actions/exec";

async function main() {
  const sourceDir = core.getInput("source-dir");
  const buildDir = core.getInput("build-dir");
  await exec.exec("cmake", [sourceDir || ".", "-B", buildDir || "build"]);
  core.setOutput("build-dir", buildDir || "build");

  const runBuild = core.getBooleanInput("run-build");
  if (runBuild) {
    const buildArgs = core.getMultilineInput("build-args");
    await exec.exec("cmake", ["--build", buildDir || "build", ...buildArgs]);
  }
}

main();
