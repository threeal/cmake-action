import core from "@actions/core";
import exec from "@actions/exec";

async function main() {
  const sourceDir = core.getInput("source-dir");
  const buildDir = core.getInput("build-dir");
  await exec.exec("cmake", [sourceDir || ".", "-B", buildDir || "build"]);
  core.setOutput("build-dir", buildDir || "build");

  await exec.exec("cmake", ["--build", buildDir || "build"]);
}

main();
