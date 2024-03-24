import { jest } from "@jest/globals";
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
        sourceDir: ".",
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
