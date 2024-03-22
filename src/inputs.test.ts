import { jest } from "@jest/globals";

jest.unstable_mockModule("@actions/core", () => ({
  getBooleanInput: jest.fn(),
  getInput: jest.fn(),
  getMultilineInput: jest.fn(),
}));

describe("get action inputs", () => {
  describe("with default values", () => {
    beforeEach(async () => {
      const { getBooleanInput, getInput, getMultilineInput } = await import(
        "@actions/core"
      );

      jest.mocked(getBooleanInput).mockReturnValue(false);
      jest.mocked(getInput).mockReturnValue("");
      jest.mocked(getMultilineInput).mockReturnValue([]);
    });

    it("should get the action inputs", async () => {
      const { getInputs } = await import("./inputs.js");

      const inputs = getInputs();

      expect(inputs).toStrictEqual({
        sourceDir: ".",
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
      });
    });
  });

  describe("with specified values", () => {
    beforeEach(async () => {
      const { getBooleanInput, getInput, getMultilineInput } = await import(
        "@actions/core"
      );

      jest.mocked(getBooleanInput).mockImplementation((name) => {
        switch (name) {
          case "run-build":
            return true;
        }
        throw new Error(`invalid input name: ${name}`);
      });

      jest.mocked(getInput).mockImplementation((name) => {
        switch (name) {
          case "source-dir":
            return "some-source";
          case "build-dir":
            return "some-build";
          case "generator":
            return "some-generator";
          case "c-compiler":
            return "some-c-compiler";
          case "cxx-compiler":
            return "some-cxx-compiler";
        }
        throw new Error(`invalid input name: ${name}`);
      });

      jest.mocked(getMultilineInput).mockImplementation((name) => {
        switch (name) {
          case "c-flags":
            return ["some-c-flag another-c-flag", "some-other-c-flag"];
          case "cxx-flags":
            return ["some-cxx-flag another-cxx-flag", "some-other-cxx-flag"];
          case "options":
            return ["some-options another-options", "some-other-options"];
          case "args":
            return ["some-args another-args", "some-other-args"];
          case "build-args":
            return [
              "some-build-args another-build-args",
              "some-other-build-args",
            ];
        }
        throw new Error(`invalid input name: ${name}`);
      });
    });

    it("should get the action inputs", async () => {
      const { getInputs } = await import("./inputs.js");

      const inputs = getInputs();

      expect(inputs).toStrictEqual({
        sourceDir: "some-source",
        buildDir: "some-build",
        generator: "some-generator",
        cCompiler: "some-c-compiler",
        cxxCompiler: "some-cxx-compiler",
        cFlags: "some-c-flag another-c-flag some-other-c-flag",
        cxxFlags: "some-cxx-flag another-cxx-flag some-other-cxx-flag",
        options: ["some-options", "another-options", "some-other-options"],
        args: ["some-args", "another-args", "some-other-args"],
        runBuild: true,
        buildArgs: [
          "some-build-args",
          "another-build-args",
          "some-other-build-args",
        ],
      });
    });
  });
});
