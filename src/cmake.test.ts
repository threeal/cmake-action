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
  configure: {
    generator: "",
    options: [],
    args: [],
  },
  build: {
    enabled: true,
    args: [],
  },
};

jest.unstable_mockModule("./exec.js", () => ({
  exec: jest.fn(),
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
      context: { configure: { generator: "Ninja", options: [], args: [] } },
      expectedArgs: ["-B", "build", "-G", "Ninja"],
    },
    {
      name: "with additional options specified",
      context: {
        configure: {
          generator: "",
          options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"],
          args: [],
        },
      },
      expectedArgs: [
        "-B",
        "build",
        "-DBUILD_TESTING=ON",
        "-DBUILD_EXAMPLES=ON",
      ],
    },
    {
      name: "with additional arguments specified",
      context: {
        configure: {
          generator: "",
          options: [],
          args: ["-Wdev", "-Wdeprecated"],
        },
      },
      expectedArgs: ["-B", "build", "-Wdev", "-Wdeprecated"],
    },
    {
      name: "with all specified",
      context: {
        sourceDir: "project",
        buildDir: "output",
        configure: {
          generator: "Ninja",
          options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON"],
          args: ["-Wdev", "-Wdeprecated"],
        },
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
      const { exec } = await import("./exec.js");

      jest.mocked(exec).mockReset();

      await configureProject({ ...defaultContext, ...testCase.context });

      expect(exec).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenLastCalledWith("cmake", testCase.expectedArgs);
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
      context: { build: { enabled: true, args: ["--target", "foo"] } },
      expectedArgs: ["--build", "build", "--target", "foo"],
    },
    {
      name: "with all specified",
      context: {
        buildDir: "output",
        build: {
          enabled: true,
          args: ["--target", "foo"],
        },
      },
      expectedArgs: ["--build", "output", "--target", "foo"],
    },
  ];

  for (const testCase of testCases) {
    it(`should execute the correct command ${testCase.name}`, async () => {
      const { buildProject } = await import("./cmake.js");
      const { exec } = await import("./exec.js");

      jest.mocked(exec).mockReset();

      await buildProject({ ...defaultContext, ...testCase.context });

      expect(exec).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenLastCalledWith("cmake", testCase.expectedArgs);
    });
  }
});
