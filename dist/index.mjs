import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

function r(r){return function(r){if("object"==typeof(e=r)&&null!==e&&"message"in e&&"string"==typeof e.message)return r;var e;try{return new Error(JSON.stringify(r))}catch(e){return new Error(String(r))}}(r).message}

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
    if (context.generator) {
        configureArgs.push(...["-G", context.generator]);
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
function buildProject(context) {
    execFileSync("cmake", ["--build", context.buildDir, ...context.buildArgs], {
        stdio: "inherit",
    });
}

/**
 * Retrieves an action input.
 * @param key - The key of the action input.
 * @returns The action input value as a string.
 */
function getInput(key) {
    const value = process.env[`INPUT_${key.toUpperCase()}`] || "";
    return value.trim();
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
        generator: getInput("generator"),
        options,
        args: getInput("args")
            .split(/\s+/)
            .filter((arg) => arg != ""),
        runBuild: getInput("run-build") == "true",
        buildArgs: getInput("build-args")
            .split(/\s+/)
            .filter((arg) => arg != ""),
    };
}

try {
    const context = getContext();
    configureProject(context);
    fs.appendFileSync(process.env["GITHUB_OUTPUT"], `build-dir=${context.buildDir}${os.EOL}`);
    if (context.runBuild) {
        buildProject(context);
    }
}
catch (err) {
    process.exitCode = 1;
    process.stdout.write(`::error::${r(err)}${os.EOL}`);
}
