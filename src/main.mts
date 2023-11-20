import core from "@actions/core";
import exec from "@actions/exec";

async function main() {
  await exec.exec("cmake", [".", "-B", "build"]);
  core.setOutput("build-dir", "build");
}

main();
