import core from "@actions/core";
import exec from "@actions/exec";
import io from "@actions/io";

async function main() {
  const sourceDir = core.getInput("source-dir");
  const buildDir = core.getInput("build-dir");

  const configureArgs = [sourceDir || ".", "-B", buildDir || "build"];

  const generator = core.getInput("generator");
  if (generator) configureArgs.push(...["-G", generator]);

  if (generator.match(/ninja/gi) && !(await io.which("ninja"))) {
    switch (process.platform) {
      case "linux":
        await exec.exec("sudo", ["apt", "install", "-y", "ninja-build"]);
        break;
      case "darwin":
        await exec.exec("brew", ["install", "ninja"]);
        break;
      case "win32":
        await exec.exec("choco", ["install", "ninja"]);
        break;
    }
  }

  const cCompiler = core.getInput("c-compiler");
  if (cCompiler) configureArgs.push("-DCMAKE_C_COMPILER=" + cCompiler);

  const cxxCompiler = core.getInput("cxx-compiler");
  if (cxxCompiler) configureArgs.push("-DCMAKE_CXX_COMPILER=" + cxxCompiler);

  const cFlags = core.getMultilineInput("c-flags").join(" ");
  if (cFlags) configureArgs.push("-DCMAKE_C_FLAGS=" + cFlags);

  const cxxFlags = core.getMultilineInput("cxx-flags").join(" ");
  if (cxxFlags) configureArgs.push("-DCMAKE_CXX_FLAGS=" + cxxFlags);

  const options = core
    .getMultilineInput("options")
    .flatMap((opts) => opts.split(" "))
    .map((opt) => "-D" + opt);
  configureArgs.push(...options);

  const args = core
    .getMultilineInput("args")
    .flatMap((args) => args.split(" "));
  configureArgs.push(...args);

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
