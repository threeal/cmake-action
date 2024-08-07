import { jest } from "@jest/globals";
import type { Context } from "./context.js";

interface TestCase {
  name: string;
  context?: Partial<Context>;
  expectedArgs: string[];
}

const defaultContext: Context = {
  sourceDir: "",
  buildDir: "build",
  generator: "",
  options: [],
  args: [],
  runBuild: true,
  buildArgs: [],
};

jest.unstable_mockModule("node:child_process", () => ({
  execFileSync: jest.fn(),
}));

describe("configure a CMake project", () => {
  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
      expectedArgs: ["-B", "build"],
    },
    {
      name: "with source directory specified",
      context: { sourceDir: "project" },
      expectedArgs: ["project", "-B", "build"],
    },
    {
      name: "with build directory specified",
      context: { buildDir: "output" },
      expectedArgs: ["-B", "output"],
    },
    {
      name: "with generator specified",
      context: { generator: "Ninja" },
      expectedArgs: ["-B", "build", "-G", "Ninja"],
    },
    {
      name: "with additional options specified",
      context: { options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"] },
      expectedArgs: [
        "-B",
        "build",
        "-DBUILD_TESTING=ON",
        "-DBUILD_EXAMPLES=ON",
      ],
    },
    {
      name: "with additional arguments specified",
      context: { args: ["-Wdev", "-Wdeprecated"] },
      expectedArgs: ["-B", "build", "-Wdev", "-Wdeprecated"],
    },
    {
      name: "with all specified",
      context: {
        sourceDir: "project",
        buildDir: "output",
        generator: "Ninja",
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"],
        args: ["-Wdev", "-Wdeprecated"],
      },
      expectedArgs: [
        "project",
        "-B",
        "output",
        "-G",
        "Ninja",
        "-DBUILD_TESTING=ON",
        "-DBUILD_EXAMPLES=ON",
        "-Wdev",
        "-Wdeprecated",
      ],
    },
  ];

  for (const testCase of testCases) {
    it(`should execute the correct command ${testCase.name}`, async () => {
      const { configureProject } = await import("./cmake.js");
      const { execFileSync } = await import("node:child_process");

      jest.mocked(execFileSync).mockReset();

      configureProject({ ...defaultContext, ...testCase.context });

      expect(execFileSync).toHaveBeenCalledTimes(1);
      expect(execFileSync).toHaveBeenLastCalledWith(
        "cmake",
        testCase.expectedArgs,
        { stdio: "inherit" },
      );
    });
  }
});

describe("build a CMake project", () => {
  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
      expectedArgs: ["--build", "build"],
    },
    {
      name: "with build directory specified",
      context: { buildDir: "output" },
      expectedArgs: ["--build", "output"],
    },
    {
      name: "with additional arguments specified",
      context: { buildArgs: ["--target", "foo"] },
      expectedArgs: ["--build", "build", "--target", "foo"],
    },
    {
      name: "with all specified",
      context: {
        buildDir: "output",
        buildArgs: ["--target", "foo"],
      },
      expectedArgs: ["--build", "output", "--target", "foo"],
    },
  ];

  for (const testCase of testCases) {
    it(`should execute the correct command ${testCase.name}`, async () => {
      const { buildProject } = await import("./cmake.js");
      const { execFileSync } = await import("node:child_process");

      jest.mocked(execFileSync).mockReset();

      buildProject({ ...defaultContext, ...testCase.context });

      expect(execFileSync).toHaveBeenCalledTimes(1);
      expect(execFileSync).toHaveBeenLastCalledWith(
        "cmake",
        testCase.expectedArgs,
        { stdio: "inherit" },
      );
    });
  }
});
