import path from "node:path";
import { Inputs, getInputs } from "./inputs.js";

describe("get action inputs", () => {
  interface TestCase {
    name: string;
    env?: Record<string, string>;
    expectedInputs?: Partial<Inputs>;
  }

  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
    },
    {
      name: "with source directory specified",
      env: { "INPUT_SOURCE-DIR": "project" },
      expectedInputs: {
        sourceDir: "project",
        buildDir: path.join("project", "build"),
      },
    },
    {
      name: "with build directory specified",
      env: { "INPUT_BUILD-DIR": "output" },
      expectedInputs: { buildDir: "output" },
    },
    {
      name: "with source and build directories specified",
      env: {
        "INPUT_SOURCE-DIR": "project",
        "INPUT_BUILD-DIR": "output",
      },
      expectedInputs: {
        sourceDir: "project",
        buildDir: "output",
      },
    },
    {
      name: "with generator specified",
      env: { INPUT_GENERATOR: "Ninja" },
      expectedInputs: { generator: "Ninja" },
    },
    {
      name: "with C compiler specified",
      env: { "INPUT_C-COMPILER": "clang" },
      expectedInputs: { cCompiler: "clang" },
    },
    {
      name: "with C++ compiler specified",
      env: { "INPUT_CXX-COMPILER": "clang++" },
      expectedInputs: { cxxCompiler: "clang++" },
    },
    {
      name: "with C flags specified",
      env: { "INPUT_C-FLAGS": "-Werror -Wall\n-Wextra" },
      expectedInputs: { cFlags: "-Werror -Wall -Wextra" },
    },
    {
      name: "with C++ flags specified",
      env: { "INPUT_CXX-FLAGS": "-Werror -Wall\n-Wextra  -Wpedantic" },
      expectedInputs: { cxxFlags: "-Werror -Wall -Wextra -Wpedantic" },
    },
    {
      name: "with additional options specified",
      env: {
        INPUT_OPTIONS: "BUILD_TESTING=ON BUILD_EXAMPLES=ON\nBUILD_DOCS=ON",
      },
      expectedInputs: {
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
      },
    },
    {
      name: "with additional arguments specified",
      env: { INPUT_ARGS: "-Wdev -Wdeprecated\n--fresh" },
      expectedInputs: { args: ["-Wdev", "-Wdeprecated", "--fresh"] },
    },
    {
      name: "with run build specified",
      env: { "INPUT_RUN-BUILD": "true" },
      expectedInputs: { runBuild: true },
    },
    {
      name: "with additional build arguments specified",
      env: { "INPUT_BUILD-ARGS": "--target foo\n--parallel  8" },
      expectedInputs: { buildArgs: ["--target", "foo", "--parallel", "8"] },
    },
    {
      name: "with all specified",
      env: {
        "INPUT_SOURCE-DIR": "project",
        "INPUT_BUILD-DIR": "output",
        INPUT_GENERATOR: "Ninja",
        "INPUT_C-COMPILER": "clang",
        "INPUT_CXX-COMPILER": "clang++",
        "INPUT_C-FLAGS": "-Werror -Wall\n-Wextra",
        "INPUT_CXX-FLAGS": "-Werror -Wall\n-Wextra  -Wpedantic",
        INPUT_OPTIONS: "BUILD_TESTING=ON BUILD_EXAMPLES=ON\nBUILD_DOCS=ON",
        INPUT_ARGS: "-Wdev -Wdeprecated\n--fresh",
        "INPUT_RUN-BUILD": "true",
        "INPUT_BUILD-ARGS": "--target foo\n--parallel  8",
      },
      expectedInputs: {
        sourceDir: "project",
        buildDir: "output",
        generator: "Ninja",
        cCompiler: "clang",
        cxxCompiler: "clang++",
        cFlags: "-Werror -Wall -Wextra",
        cxxFlags: "-Werror -Wall -Wextra -Wpedantic",
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
        args: ["-Wdev", "-Wdeprecated", "--fresh"],
        runBuild: true,
        buildArgs: ["--target", "foo", "--parallel", "8"],
      },
    },
  ];

  for (const testCase of testCases) {
    it(`should get the action inputs ${testCase.name}`, async () => {
      const prevEnv = process.env;
      process.env = {
        ...process.env,
        ...testCase.env,
      };

      expect(getInputs()).toStrictEqual({
        sourceDir: "",
        buildDir: "build",
        generator: "",
        cCompiler: "",
        cxxCompiler: "",
        cFlags: "",
        cxxFlags: "",
        options: [],
        args: [],
        runBuild: false,
        buildArgs: [],
        ...testCase.expectedInputs,
      });

      process.env = prevEnv;
    });
  }
});
