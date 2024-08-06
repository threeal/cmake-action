import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ // The require scope
/******/ var __nccwpck_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nccwpck_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__nccwpck_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ../../../.yarn/berry/cache/catched-error-message-npm-0.0.1-9126a73d25-10c0.zip/node_modules/catched-error-message/dist/index.esm.js
function r(r){return function(r){if("object"==typeof(e=r)&&null!==e&&"message"in e&&"string"==typeof e.message)return r;var e;try{return new Error(JSON.stringify(r))}catch(e){return new Error(String(r))}}(r).message}
//# sourceMappingURL=index.esm.js.map

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
var external_node_fs_default = /*#__PURE__*/__nccwpck_require__.n(external_node_fs_namespaceObject);
;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
var external_node_os_default = /*#__PURE__*/__nccwpck_require__.n(external_node_os_namespaceObject);
;// CONCATENATED MODULE: external "node:child_process"
const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
;// CONCATENATED MODULE: ./src/cmake.ts

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
    (0,external_node_child_process_namespaceObject.execFileSync)("cmake", configureArgs, { stdio: "inherit" });
}
/**
 * Build a CMake project.
 *
 * @param inputs - The action inputs.
 */
function buildProject(inputs) {
    (0,external_node_child_process_namespaceObject.execFileSync)("cmake", ["--build", inputs.buildDir, ...inputs.buildArgs], {
        stdio: "inherit",
    });
}

;// CONCATENATED MODULE: external "node:path"
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
var external_node_path_default = /*#__PURE__*/__nccwpck_require__.n(external_node_path_namespaceObject);
;// CONCATENATED MODULE: ./src/inputs.ts

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
        buildDir: getInput("build-dir") || external_node_path_default().join(sourceDir, "build"),
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

;// CONCATENATED MODULE: ./src/index.ts





try {
    const inputs = getInputs();
    configureProject(inputs);
    external_node_fs_default().appendFileSync(process.env["GITHUB_OUTPUT"], `build-dir=${inputs.buildDir}${(external_node_os_default()).EOL}`);
    if (inputs.runBuild) {
        buildProject(inputs);
    }
}
catch (err) {
    process.exitCode = 1;
    process.stdout.write(`::error::${r(err)}${(external_node_os_default()).EOL}`);
}

