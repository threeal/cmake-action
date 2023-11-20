import core from "@actions/core";
import exec from "@actions/exec";

async function main() {
  const sourceDir = core.getInput("source-dir");
  const buildDir = core.getInput("build-dir");

  const configureArgs = [sourceDir || ".", "-B", buildDir || "build"];

  const generator = core.getInput("generator");
  if (generator) configureArgs.push(...["-G", generator]);

  const cCompiler = core.getInput("c-compiler");
  if (cCompiler) configureArgs.push("-DCMAKE_C_COMPILER=" + cCompiler);

  const cxxCompiler = core.getInput("cxx-compiler");
  if (cxxCompiler) configureArgs.push("-DCMAKE_CXX_COMPILER=" + cxxCompiler);

  await exec.exec("cmake", configureArgs);
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
