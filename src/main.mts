import core from "@actions/core";
import exec from "@actions/exec";

async function main() {
  const sourceDir = core.getInput("source-dir");
  const buildDir = core.getInput("build-dir");
  await exec.exec("cmake", [sourceDir || ".", "-B", buildDir || "build"]);
  core.setOutput("build-dir", buildDir || "build");

  const runBuild = core.getBooleanInput("run-build");
  const runTest = core.getBooleanInput("run-test");

  if (runBuild || runTest) {
    const buildArgs = core
      .getMultilineInput("build-args")
      .flatMap((args) => args.split(" "));
    await exec.exec("cmake", ["--build", buildDir || "build", ...buildArgs]);
  }

  if (runTest) {
    const testArgs = core
      .getMultilineInput("test-args")
      .flatMap((args) => args.split(" "));
    await exec.exec("ctest", [
      "--test-dir",
      buildDir || "build",
      "--output-on-failure",
      "--no-tests=error",
      ...testArgs,
    ]);
  }
}

main();
