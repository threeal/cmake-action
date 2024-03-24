import { jest } from "@jest/globals";
import type { Inputs } from "./inputs.js";

jest.unstable_mockModule("@actions/core", () => ({
  getBooleanInput: jest.fn(),
  getInput: jest.fn(),
  getMultilineInput: jest.fn(),
}));

describe("get action inputs", () => {
  const defaultInputs: Inputs = {
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
  };

  let booleanInputs: { [key: string]: boolean };
  let stringInputs: { [key: string]: string };
  let multilineInputs: { [key: string]: string[] };

  beforeEach(async () => {
    const core = await import("@actions/core");

    booleanInputs = { "run-build": true };
    stringInputs = {};
    multilineInputs = {};

    jest.mocked(core.getBooleanInput).mockImplementation((name) => {
      return booleanInputs[name] ?? false;
    });

    jest.mocked(core.getInput).mockImplementation((name) => {
      return stringInputs[name] ?? "";
    });

    jest.mocked(core.getMultilineInput).mockImplementation((name) => {
      return multilineInputs[name] ?? [];
    });
  });

  it("should get the action inputs with nothing specified", async () => {
    const { getInputs } = await import("./inputs.js");

    expect(getInputs()).toStrictEqual(defaultInputs);
  });

  it("should get the action inputs with all specified", async () => {
    const { getInputs } = await import("./inputs.js");

    booleanInputs = {
      ...booleanInputs,
      "run-build": false,
    };

    stringInputs = {
      ...stringInputs,
      "source-dir": "project",
      "build-dir": "output",
      generator: "Ninja",
      "c-compiler": "clang",
      "cxx-compiler": "clang++",
    };

    multilineInputs = {
      ...multilineInputs,
      "c-flags": ["-Werror -Wall", "-Wextra"],
      "cxx-flags": ["-Werror -Wall", "-Wextra -Wpedantic"],
      options: ["BUILD_TESTING=ON BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
      args: ["-Wdev -Wdeprecated", "--fresh"],
      "build-args": ["--target foo", "--parallel 8"],
    };

    expect(getInputs()).toStrictEqual({
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
    });
  });
});
