import { execFileSync } from "node:child_process";
import type { Context } from "./context.js";

/**
 * Configures the build system of a CMake project.
 *
 * @param context - The action context.
 */
export function configureProject(context: Context): void {
  const configureArgs = [];

  if (context.sourceDir) {
    configureArgs.push(context.sourceDir);
  }

  configureArgs.push("-B", context.buildDir);

  if (context.generator) {
    configureArgs.push(...["-G", context.generator]);
  }

  if (context.cCompiler) {
    configureArgs.push("-DCMAKE_C_COMPILER=" + context.cCompiler);
  }

  if (context.cxxCompiler) {
    configureArgs.push("-DCMAKE_CXX_COMPILER=" + context.cxxCompiler);
  }

  if (context.cFlags) {
    configureArgs.push("-DCMAKE_C_FLAGS=" + context.cFlags);
  }

  if (context.cxxFlags) {
    configureArgs.push("-DCMAKE_CXX_FLAGS=" + context.cxxFlags);
  }

  configureArgs.push(...context.options.map((opt) => "-D" + opt));
  configureArgs.push(...context.args);

  execFileSync("cmake", configureArgs, { stdio: "inherit" });
}

/**
 * Build a CMake project.
 *
 * @param context - The action context.
 */
export function buildProject(context: Context): void {
  execFileSync("cmake", ["--build", context.buildDir, ...context.buildArgs], {
    stdio: "inherit",
  });
}
