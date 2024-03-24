import { exec } from "@actions/exec";
import type { Inputs } from "./inputs.js";

/**
 * Configures the build system of a CMake project.
 *
 * @param inputs - The action inputs.
 */
export async function configureProject(inputs: Inputs): Promise<void> {
  const configureArgs = [inputs.sourceDir, "-B", inputs.buildDir];

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

  await exec("cmake", configureArgs);
}

/**
 * Build a CMake project.
 *
 * @param inputs - The action inputs.
 */
export async function buildProject(inputs: Inputs): Promise<void> {
  await exec("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs]);
}
