import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

function r(r){return function(r){if("object"==typeof(e=r)&&null!==e&&"message"in e&&"string"==typeof e.message)return r;var e;try{return new Error(JSON.stringify(r))}catch(e){return new Error(String(r))}}(r).message}

/**
 * Configures the build system of a CMake project.
 *
 * @param inputs - The action inputs.
 */
function configureProject(inputs) {
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
function buildProject(inputs) {
    execFileSync("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs], {
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
function getInputs() {
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
    const inputs = getInputs();
    configureProject(inputs);
    fs.appendFileSync(process.env["GITHUB_OUTPUT"], `build-dir=${inputs.buildDir}${os.EOL}`);
    if (inputs.runBuild) {
        buildProject(inputs);
    }
}
catch (err) {
    process.exitCode = 1;
    process.stdout.write(`::error::${r(err)}${os.EOL}`);
}
