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

  beforeEach(async () => {
    const core = await import("@actions/core");

    jest.mocked(core.getBooleanInput).mockImplementation((name) => {
      return name == "run-build";
    });

    jest.mocked(core.getInput).mockReturnValue("");
    jest.mocked(core.getMultilineInput).mockReturnValue([]);
  });

  it("should get the action inputs with nothing specified", async () => {
    const { getInputs } = await import("./inputs.js");

    expect(getInputs()).toStrictEqual(defaultInputs);
  });

  it("should get the action inputs with all specified", async () => {
    const { getInputs } = await import("./inputs.js");
    const core = await import("@actions/core");

    jest.mocked(core.getBooleanInput).mockReturnValue(false);

    jest.mocked(core.getInput).mockImplementation((name) => {
      switch (name) {
        case "source-dir":
          return "project";
        case "build-dir":
          return "output";
        case "generator":
          return "Ninja";
        case "c-compiler":
          return "clang";
        case "cxx-compiler":
          return "clang++";
      }
      return "";
    });

    jest.mocked(core.getMultilineInput).mockImplementation((name) => {
      switch (name) {
        case "c-flags":
          return ["-Werror -Wall", "-Wextra"];
        case "cxx-flags":
          return ["-Werror -Wall", "-Wextra -Wpedantic"];
        case "options":
          return ["BUILD_TESTING=ON BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"];
        case "args":
          return ["-Wdev -Wdeprecated", "--fresh"];
        case "build-args":
          return ["--target foo", "--parallel 8"];
      }
      return [];
    });

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
