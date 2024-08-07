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

  if (context.configure.generator) {
    configureArgs.push(...["-G", context.configure.generator]);
  }

  configureArgs.push(...context.configure.options.map((opt) => "-D" + opt));
  configureArgs.push(...context.configure.args);

  execFileSync("cmake", configureArgs, { stdio: "inherit" });
}

/**
 * Build a CMake project.
 *
 * @param context - The action context.
 */
export function buildProject(context: Context): void {
  execFileSync("cmake", ["--build", context.buildDir, ...context.build.args], {
    stdio: "inherit",
  });
}
