import { exec } from "./exec.js";
import type { Context } from "./context.js";

/**
 * Configures the build system for a CMake project.
 *
 * Constructs and runs the `cmake` command to configure the project with the specified
 * source directory, build directory, generator, options, and additional arguments.
 *
 * @param context - The action context containing configuration details.
 * @returns A promise that resolves when the build system is successfully configured.
 */
export async function configureProject(context: Context): Promise<void> {
  const configureArgs = [];

  if (context.sourceDir) {
    configureArgs.push(context.sourceDir);
  }

  configureArgs.push("-B", context.buildDir);

  if (context.configure.generator) {
    configureArgs.push("-G", context.configure.generator);
  }

  configureArgs.push(...context.configure.options.map((opt) => "-D" + opt));
  configureArgs.push(...context.configure.args);

  await exec("cmake", configureArgs);
}

/**
 * Builds a CMake project.
 *
 * Runs the `cmake --build` command to build the project using the specified
 * build directory and additional arguments.
 *
 * @param context - The action context containing build details.
 * @returns A promise that resolves when the project is successfully built.
 */
export async function buildProject(context: Context): Promise<void> {
  await exec("cmake", ["--build", context.buildDir, ...context.build.args]);
}
