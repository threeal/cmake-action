import { jest } from "@jest/globals";
import type { Inputs } from "./inputs.js";

interface TestCase {
  name: string;
  inputs?: Partial<Inputs>;
  expectedArgs: string[];
}

const defaultInputs: Inputs = {
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
      inputs: { sourceDir: "project" },
      expectedArgs: ["project", "-B", "build"],
    },
    {
      name: "with build directory specified",
      inputs: { buildDir: "output" },
      expectedArgs: ["-B", "output"],
    },
    {
      name: "with generator specified",
      inputs: { generator: "Ninja" },
      expectedArgs: ["-B", "build", "-G", "Ninja"],
    },
    {
      name: "with C compiler specified",
      inputs: { cCompiler: "clang" },
      expectedArgs: ["-B", "build", "-DCMAKE_C_COMPILER=clang"],
    },
    {
      name: "with C++ compiler specified",
      inputs: { cxxCompiler: "clang++" },
      expectedArgs: ["-B", "build", "-DCMAKE_CXX_COMPILER=clang++"],
    },
    {
      name: "with C flags specified",
      inputs: { cFlags: "-Werror -Wall" },
      expectedArgs: ["-B", "build", "-DCMAKE_C_FLAGS=-Werror -Wall"],
    },
    {
      name: "with C++ flags specified",
      inputs: { cxxFlags: "-Werror -Wall -Wextra" },
      expectedArgs: ["-B", "build", "-DCMAKE_CXX_FLAGS=-Werror -Wall -Wextra"],
    },
    {
      name: "with additional options specified",
      inputs: { options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"] },
      expectedArgs: [
        "-B",
        "build",
        "-DBUILD_TESTING=ON",
        "-DBUILD_EXAMPLES=ON",
      ],
    },
    {
      name: "with additional arguments specified",
      inputs: { args: ["-Wdev", "-Wdeprecated"] },
      expectedArgs: ["-B", "build", "-Wdev", "-Wdeprecated"],
    },
    {
      name: "with all specified",
      inputs: {
        sourceDir: "project",
        buildDir: "output",
        generator: "Ninja",
        cCompiler: "clang",
        cxxCompiler: "clang++",
        cFlags: "-Werror -Wall",
        cxxFlags: "-Werror -Wall -Wextra",
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"],
        args: ["-Wdev", "-Wdeprecated"],
      },
      expectedArgs: [
        "project",
        "-B",
        "output",
        "-G",
        "Ninja",
        "-DCMAKE_C_COMPILER=clang",
        "-DCMAKE_CXX_COMPILER=clang++",
        "-DCMAKE_C_FLAGS=-Werror -Wall",
        "-DCMAKE_CXX_FLAGS=-Werror -Wall -Wextra",
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

      configureProject({ ...defaultInputs, ...testCase.inputs });

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
      inputs: { buildDir: "output" },
      expectedArgs: ["--build", "output"],
    },
    {
      name: "with additional arguments specified",
      inputs: { buildArgs: ["--target", "foo"] },
      expectedArgs: ["--build", "build", "--target", "foo"],
    },
    {
      name: "with all specified",
      inputs: {
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

      buildProject({ ...defaultInputs, ...testCase.inputs });

      expect(execFileSync).toHaveBeenCalledTimes(1);
      expect(execFileSync).toHaveBeenLastCalledWith(
        "cmake",
        testCase.expectedArgs,
        { stdio: "inherit" },
      );
    });
  }
});
