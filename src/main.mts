import exec from "@actions/exec";

async function main() {
  await exec.exec("cmake", [".", "-B", "build"]);
}

main();
