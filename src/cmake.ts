import { execFileSync } from "node:child_process";
import type { Inputs } from "./inputs.js";

/**
 * Configures the build system of a CMake project.
 *
 * @param inputs - The action inputs.
 */
export function configureProject(inputs: Inputs): void {
  const configureArgs = [];

  if (inputs.sourceDir) {
    configureArgs.push(inputs.sourceDir);
  }

  configureArgs.push("-B", inputs.buildDir);

  if (inputs.generator) {
    configureArgs.push(...["-G", inputs.generator]);
  }

  if (inputs.cCompiler) {
    configureArgs.push("-DCMAKE_C_COMPILER=" + inputs.cCompiler);
  }

  if (inputs.cxxCompiler) {
    configureArgs.push("-DCMAKE_CXX_COMPILER=" + inputs.cxxCompiler);
  }

  if (inputs.cFlags) {
    configureArgs.push("-DCMAKE_C_FLAGS=" + inputs.cFlags);
  }

  if (inputs.cxxFlags) {
    configureArgs.push("-DCMAKE_CXX_FLAGS=" + inputs.cxxFlags);
  }

  configureArgs.push(...inputs.options.map((opt) => "-D" + opt));
  configureArgs.push(...inputs.args);

  execFileSync("cmake", configureArgs, { stdio: "inherit" });
}

/**
 * Build a CMake project.
 *
 * @param inputs - The action inputs.
 */
export function buildProject(inputs: Inputs): void {
  execFileSync("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs], {
    stdio: "inherit",
  });
}
