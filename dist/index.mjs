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
    return {
        sourceDir,
        buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
        generator: getInput("generator"),
        cCompiler: getInput("c-compiler"),
        cxxCompiler: getInput("cxx-compiler"),
        cFlags: getInput("c-flags").replaceAll(/\s+/g, " "),
        cxxFlags: getInput("cxx-flags").replaceAll(/\s+/g, " "),
        options: getInput("options")
            .split(/\s+/)
            .filter((arg) => arg != ""),
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
