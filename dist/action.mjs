import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
function getInput(name) {
    const value = process.env[`INPUT_${name.toUpperCase()}`] || "";
    return value.trim();
}
/**
 * Sets the value of a GitHub Actions output.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value of the GitHub Actions output
 */
function setOutput(name, value) {
    fs.appendFileSync(process.env["GITHUB_OUTPUT"], `${name}=${value}${os.EOL}`);
}
/**
 * Logs an error message on GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
function error(err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stdout.write(`::error::${message}${os.EOL}`);
}

/**
 * Configures the build system of a CMake project.
 *
 * @param context - The action context.
 */
function configureProject(context) {
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
function buildProject(context) {
    execFileSync("cmake", ["--build", context.buildDir, ...context.build.args], {
        stdio: "inherit",
    });
}

function getContext() {
    const sourceDir = getInput("source-dir");
    const options = [];
    let input = getInput("c-compiler");
    if (input)
        options.push(`CMAKE_C_COMPILER=${input}`);
    input = getInput("cxx-compiler");
    if (input)
        options.push(`CMAKE_CXX_COMPILER=${input}`);
    input = getInput("c-flags");
    if (input) {
        const flags = input.replaceAll(/\s+/g, " ");
        options.push(`CMAKE_C_FLAGS=${flags}`);
    }
    input = getInput("cxx-flags");
    if (input) {
        const flags = input.replaceAll(/\s+/g, " ");
        options.push(`CMAKE_CXX_FLAGS=${flags}`);
    }
    input = getInput("options");
    if (input) {
        const opts = input.split(/\s+/).filter((arg) => arg != "");
        for (const opt of opts) {
            options.push(opt);
        }
    }
    return {
        sourceDir,
        buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
        configure: {
            generator: getInput("generator"),
            options,
            args: getInput("args")
                .split(/\s+/)
                .filter((arg) => arg != ""),
        },
        build: {
            enabled: getInput("run-build") == "true",
            args: getInput("build-args")
                .split(/\s+/)
                .filter((arg) => arg != ""),
        },
    };
}

try {
    const context = getContext();
    configureProject(context);
    setOutput("build-dir", context.buildDir);
    if (context.build.enabled) {
        buildProject(context);
    }
}
catch (err) {
    error(err);
    process.exit(1);
}
