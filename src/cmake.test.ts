import { jest } from "@jest/globals";
import type { Inputs } from "./inputs.js";

jest.unstable_mockModule("@actions/exec", () => ({
  exec: jest.fn(),
}));

describe("configure a CMake project", () => {
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

  interface TestCase {
    name: string;
    inputs: Inputs;
    expectedArgs: string[];
  }

  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
      inputs: defaultInputs,
      expectedArgs: [".", "-B", "build"],
    },
    {
      name: "with source directory specified",
      inputs: {
        ...defaultInputs,
        sourceDir: "project",
      },
      expectedArgs: ["project", "-B", "build"],
    },
    {
      name: "with build directory specified",
      inputs: {
        ...defaultInputs,
        buildDir: "output",
      },
      expectedArgs: [".", "-B", "output"],
    },
    {
      name: "with generator specified",
      inputs: {
        ...defaultInputs,
        generator: "Ninja",
      },
      expectedArgs: [".", "-B", "build", "-G", "Ninja"],
    },
    {
      name: "with C compiler specified",
      inputs: {
        ...defaultInputs,
        cCompiler: "clang",
      },
      expectedArgs: [".", "-B", "build", "-DCMAKE_C_COMPILER=clang"],
    },
    {
      name: "with C++ compiler specified",
      inputs: {
        ...defaultInputs,
        cxxCompiler: "clang++",
      },
      expectedArgs: [".", "-B", "build", "-DCMAKE_CXX_COMPILER=clang++"],
    },
    {
      name: "with C flags specified",
      inputs: {
        ...defaultInputs,
        cFlags: "-Werror -Wall",
      },
      expectedArgs: [".", "-B", "build", "-DCMAKE_C_FLAGS=-Werror -Wall"],
    },
    {
      name: "with C++ flags specified",
      inputs: {
        ...defaultInputs,
        cxxFlags: "-Werror -Wall -Wextra",
      },
      expectedArgs: [
        ".",
        "-B",
        "build",
        "-DCMAKE_CXX_FLAGS=-Werror -Wall -Wextra",
      ],
    },
    {
      name: "with additional options specified",
      inputs: {
        ...defaultInputs,
        options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"],
      },
      expectedArgs: [
        ".",
        "-B",
        "build",
        "-DBUILD_TESTING=ON",
        "-DBUILD_EXAMPLES=ON",
      ],
    },
    {
      name: "with additional arguments specified",
      inputs: {
        ...defaultInputs,
        args: ["-Wdev", "-Wdeprecated"],
      },
      expectedArgs: [".", "-B", "build", "-Wdev", "-Wdeprecated"],
    },
    {
      name: "with all specified",
      inputs: {
        ...defaultInputs,
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

  for (const { name, inputs, expectedArgs } of testCases) {
    it(`should execute the correct command ${name}`, async () => {
      const { configureProject } = await import("./cmake.js");
      const { exec } = await import("@actions/exec");

      jest.mocked(exec).mockReset();

      await expect(configureProject(inputs)).resolves.toBeUndefined();

      expect(exec).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenLastCalledWith("cmake", expectedArgs);
    });
  }
});
