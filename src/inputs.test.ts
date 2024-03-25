import { jest } from "@jest/globals";
import path from "node:path";
import type { Inputs } from "./inputs.js";

jest.unstable_mockModule("@actions/core", () => ({
  getBooleanInput: jest.fn(),
  getInput: jest.fn(),
  getMultilineInput: jest.fn(),
}));

describe("get action inputs", () => {
  interface TestCase {
    name: string;
    booleanInputs?: { [key: string]: boolean };
    stringInputs?: { [key: string]: string };
    multilineInputs?: { [key: string]: string[] };
    expectedInputs?: Partial<Inputs>;
  }

  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
    },
    {
      name: "with source directory specified",
      stringInputs: { "source-dir": "project" },
      expectedInputs: {
        sourceDir: "project",
        buildDir: path.join("project", "build"),
      },
    },
    {
      name: "with build directory specified",
      stringInputs: { "build-dir": "output" },
      expectedInputs: { buildDir: "output" },
    },
    {
      name: "with source and build directories specified",
      stringInputs: {
        "source-dir": "project",
        "build-dir": "output",
      },
      expectedInputs: {
        sourceDir: "project",
        buildDir: "output",
      },
    },
    {
      name: "with generator specified",
      stringInputs: { generator: "Ninja" },
      expectedInputs: { generator: "Ninja" },
    },
    {
      name: "with C compiler specified",
      stringInputs: { "c-compiler": "clang" },
      expectedInputs: { cCompiler: "clang" },
    },
    {
      name: "with C++ compiler specified",
      stringInputs: { "cxx-compiler": "clang++" },
      expectedInputs: { cxxCompiler: "clang++" },
    },
    {
      name: "with C flags specified",
      multilineInputs: { "c-flags": ["-Werror -Wall", "-Wextra"] },
      expectedInputs: { cFlags: "-Werror -Wall -Wextra" },
    },
    {
      name: "with C++ flags specified",
      multilineInputs: { "cxx-flags": ["-Werror -Wall", "-Wextra -Wpedantic"] },
      expectedInputs: { cxxFlags: "-Werror -Wall -Wextra -Wpedantic" },
    },
    {
      name: "with additional options specified",
      multilineInputs: {
        options: ["BUILD_TESTING=ON BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
      },
      expectedInputs: {
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
      },
    },
    {
      name: "with additional arguments specified",
      multilineInputs: { args: ["-Wdev -Wdeprecated", "--fresh"] },
      expectedInputs: { args: ["-Wdev", "-Wdeprecated", "--fresh"] },
    },
    {
      name: "with run build specified",
      booleanInputs: { "run-build": false },
      expectedInputs: { runBuild: false },
    },
    {
      name: "with additional build arguments specified",
      multilineInputs: { "build-args": ["--target foo", "--parallel 8"] },
      expectedInputs: { buildArgs: ["--target", "foo", "--parallel", "8"] },
    },
    {
      name: "with all specified",
      booleanInputs: {
        "run-build": false,
      },
      stringInputs: {
        "source-dir": "project",
        "build-dir": "output",
        generator: "Ninja",
        "c-compiler": "clang",
        "cxx-compiler": "clang++",
      },
      multilineInputs: {
        "c-flags": ["-Werror -Wall", "-Wextra"],
        "cxx-flags": ["-Werror -Wall", "-Wextra -Wpedantic"],
        options: ["BUILD_TESTING=ON BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
        args: ["-Wdev -Wdeprecated", "--fresh"],
        "build-args": ["--target foo", "--parallel 8"],
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
        runBuild: false,
        buildArgs: ["--target", "foo", "--parallel", "8"],
      },
    },
  ];

  for (const testCase of testCases) {
    it(`should get the action inputs ${testCase.name}`, async () => {
      const { getInputs } = await import("./inputs.js");
      const core = await import("@actions/core");

      const booleanInputs = { "run-build": true, ...testCase.booleanInputs };
      jest.mocked(core.getBooleanInput).mockImplementation((name) => {
        return booleanInputs[name] ?? false;
      });

      const stringInputs = { ...testCase.stringInputs };
      jest.mocked(core.getInput).mockImplementation((name) => {
        return stringInputs[name] ?? "";
      });

      const multilineInputs = { ...testCase.multilineInputs };
      jest.mocked(core.getMultilineInput).mockImplementation((name) => {
        return multilineInputs[name] ?? [];
      });

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
        runBuild: true,
        buildArgs: [],
        ...testCase.expectedInputs,
      });
    });
  }
});
