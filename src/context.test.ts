import path from "node:path";
import { Context, getContext } from "./context.js";

describe("get action context", () => {
  interface TestCase {
    name: string;
    env?: Record<string, string>;
    expectedContext?: Partial<Context>;
  }

  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
    },
    {
      name: "with source directory specified",
      env: { "INPUT_SOURCE-DIR": "project" },
      expectedContext: {
        sourceDir: "project",
        buildDir: path.join("project", "build"),
      },
    },
    {
      name: "with build directory specified",
      env: { "INPUT_BUILD-DIR": "output" },
      expectedContext: { buildDir: "output" },
    },
    {
      name: "with source and build directories specified",
      env: {
        "INPUT_SOURCE-DIR": "project",
        "INPUT_BUILD-DIR": "output",
      },
      expectedContext: {
        sourceDir: "project",
        buildDir: "output",
      },
    },
    {
      name: "with generator specified",
      env: { INPUT_GENERATOR: "Ninja" },
      expectedContext: {
        configure: {
          generator: "Ninja",
          options: [],
          args: [],
        },
      },
    },
    {
      name: "with C compiler specified",
      env: { "INPUT_C-COMPILER": "clang" },
      expectedContext: {
        configure: {
          generator: "",
          options: ["CMAKE_C_COMPILER=clang"],
          args: [],
        },
      },
    },
    {
      name: "with C++ compiler specified",
      env: { "INPUT_CXX-COMPILER": "clang++" },
      expectedContext: {
        configure: {
          generator: "",
          options: ["CMAKE_CXX_COMPILER=clang++"],
          args: [],
        },
      },
    },
    {
      name: "with C flags specified",
      env: { "INPUT_C-FLAGS": "-Werror -Wall\n-Wextra" },
      expectedContext: {
        configure: {
          generator: "",
          options: ["CMAKE_C_FLAGS=-Werror -Wall -Wextra"],
          args: [],
        },
      },
    },
    {
      name: "with C++ flags specified",
      env: { "INPUT_CXX-FLAGS": "-Werror -Wall\n-Wextra  -Wpedantic" },
      expectedContext: {
        configure: {
          generator: "",
          options: ["CMAKE_CXX_FLAGS=-Werror -Wall -Wextra -Wpedantic"],
          args: [],
        },
      },
    },
    {
      name: "with additional options specified",
      env: {
        INPUT_OPTIONS: "BUILD_TESTING=ON BUILD_EXAMPLES=ON\nBUILD_DOCS=ON",
      },
      expectedContext: {
        configure: {
          generator: "",
          options: ["BUILD_TESTING=ON", "BUILD_EXAMPLES=ON", "BUILD_DOCS=ON"],
          args: [],
        },
      },
    },
    {
      name: "with additional arguments specified",
      env: { INPUT_ARGS: "-Wdev -Wdeprecated\n--fresh" },
      expectedContext: {
        configure: {
          generator: "",
          options: [],
          args: ["-Wdev", "-Wdeprecated", "--fresh"],
        },
      },
    },
    {
      name: "with run build specified",
      env: { "INPUT_RUN-BUILD": "true" },
      expectedContext: { build: { enabled: true, args: [] } },
    },
    {
      name: "with additional build arguments specified",
      env: { "INPUT_BUILD-ARGS": "--target foo\n--parallel  8" },
      expectedContext: {
        build: {
          enabled: false,
          args: ["--target", "foo", "--parallel", "8"],
        },
      },
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
      expectedContext: {
        sourceDir: "project",
        buildDir: "output",
        configure: {
          generator: "Ninja",
          options: [
            "CMAKE_C_COMPILER=clang",
            "CMAKE_CXX_COMPILER=clang++",
            "CMAKE_C_FLAGS=-Werror -Wall -Wextra",
            "CMAKE_CXX_FLAGS=-Werror -Wall -Wextra -Wpedantic",
            "BUILD_TESTING=ON",
            "BUILD_EXAMPLES=ON",
            "BUILD_DOCS=ON",
          ],
          args: ["-Wdev", "-Wdeprecated", "--fresh"],
        },
        build: {
          enabled: true,
          args: ["--target", "foo", "--parallel", "8"],
        },
      },
    },
  ];

  for (const testCase of testCases) {
    it(`should get the action context ${testCase.name}`, async () => {
      const prevEnv = process.env;
      process.env = {
        ...process.env,
        ...testCase.env,
      };

      expect(getContext()).toStrictEqual({
        sourceDir: "",
        buildDir: "build",
        configure: {
          generator: "",
          options: [],
          args: [],
        },
        build: {
          enabled: false,
          args: [],
        },
        ...testCase.expectedContext,
      });

      process.env = prevEnv;
    });
  }
});
