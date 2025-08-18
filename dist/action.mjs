import 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

/**
 * @internal
 * Retrieves the value of an environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not defined.
 */
function mustGetEnvironment(name) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`the ${name} environment variable must be defined`);
    }
    return value;
}
/**
 * Retrieves the value of a GitHub Actions input.
 *
 * @param name - The name of the GitHub Actions input.
 * @returns The value of the GitHub Actions input, or an empty string if not found.
 */
function getInput(name) {
    const value = process.env[`INPUT_${name.toUpperCase()}`] ?? "";
    return value.trim();
}
/**
 * Sets the value of a GitHub Actions output.
 *
 * @param name - The name of the GitHub Actions output.
 * @param value - The value to set for the GitHub Actions output.
 * @returns A promise that resolves when the value is successfully set.
 */
async function setOutput(name, value) {
    const filePath = mustGetEnvironment("GITHUB_OUTPUT");
    await fsPromises.appendFile(filePath, `${name}=${value}${os.EOL}`);
}

/**
 * Logs an error message in GitHub Actions.
 *
 * @param err - The error, which can be of any type.
 */
function logError(err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stdout.write(`::error::${message}${os.EOL}`);
}
/**
 * Logs a command along with its arguments in GitHub Actions.
 *
 * @param command - The command to log.
 * @param args - The arguments of the command.
 */
function logCommand(command, ...args) {
    const message = [command, ...args].join(" ");
    process.stdout.write(`[command]${message}${os.EOL}`);
}

/**
 * Executes a command with the given arguments.
 *
 * The command is executed with `stdin` ignored and both `stdout` and `stderr` inherited by the parent process.
 *
 * @param command The command to execute.
 * @param args The arguments to pass to the command.
 * @returns A promise that resolves when the command exits successfully or rejects if it exits with a non-zero status code or encounters an error.
 */
async function exec(command, args) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, {
            stdio: ["ignore", "inherit", "inherit"],
        });
        logCommand(proc.spawnfile, ...proc.spawnargs.splice(1));
        proc.on("error", reject);
        proc.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command exited with status code ${code.toString()}`));
            }
        });
    });
}

/**
 * Configures the build system for a CMake project.
 *
 * Constructs and runs the `cmake` command to configure the project with the specified
 * source directory, build directory, generator, options, and additional arguments.
 *
 * @param context - The action context containing configuration details.
 * @returns A promise that resolves when the build system is successfully configured.
 */
async function configureProject(context) {
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
async function buildProject(context) {
    await exec("cmake", ["--build", context.buildDir, ...context.build.args]);
}

const regex = /"([^"]*)"|'([^']*)'|`([^`]*)`|(\S+)/g;
/**
 * Converts a space-separated string into a list of arguments.
 *
 * This function parses the provided string, which contains arguments separated by spaces and possibly enclosed in quotes, into a list of arguments.
 *
 * @param str - The space-separated string to parse.
 * @returns A list of arguments.
 */
function parse(str) {
    const args = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        args.push(match[1] || match[2] || match[3] || match[4]);
    }
    return args;
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
        options.push(...parse(input).map((opt) => opt));
    }
    return {
        sourceDir,
        buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
        configure: {
            generator: getInput("generator"),
            options,
            args: parse(getInput("args")).map((arg) => arg),
        },
        build: {
            enabled: getInput("run-build") == "true",
            args: parse(getInput("build-args")).map((arg) => arg),
        },
    };
}

try {
    const context = getContext();
    await configureProject(context);
    await setOutput("build-dir", context.buildDir);
    if (context.build.enabled) {
        await buildProject(context);
    }
}
catch (err) {
    logError(err);
    process.exit(1);
}
