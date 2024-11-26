import { jest } from "@jest/globals";
import path from "node:path";
import type { Context } from "./context.js";

jest.unstable_mockModule("gha-utils", () => ({
  getInput: jest.fn(),
}));

describe("get action context", () => {
  interface TestCase {
    name: string;
    inputs?: Record<string, string>;
    expectedContext?: Partial<Context>;
  }

  const testCases: TestCase[] = [
    {
      name: "with nothing specified",
    },
    {
      name: "with source directory specified",
      inputs: { "source-dir": "project" },
      expectedContext: {
        sourceDir: "project",
        buildDir: path.join("project", "build"),
      },
    },
    {
      name: "with build directory specified",
      inputs: { "build-dir": "output" },
      expectedContext: { buildDir: "output" },
    },
    {
      name: "with source and build directories specified",
      inputs: {
        "source-dir": "project",
        "build-dir": "output",
      },
      expectedContext: {
        sourceDir: "project",
        buildDir: "output",
      },
    },
    {
      name: "with generator specified",
      inputs: { generator: "Ninja" },
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
      inputs: { "c-compiler": "clang" },
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
      inputs: { "cxx-compiler": "clang++" },
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
      inputs: { "c-flags": "-Werror -Wall\n-Wextra" },
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
      inputs: { "cxx-flags": "-Werror -Wall\n-Wextra  -Wpedantic" },
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
      inputs: {
        options: `BUILD_TESTING=ON BUILD_EXAMPLES=ON\nBUILD_DOCS=ON "FOO=BAR BAZ"`,
      },
      expectedContext: {
        configure: {
          generator: "",
          options: [
            "BUILD_TESTING=ON",
            "BUILD_EXAMPLES=ON",
            "BUILD_DOCS=ON",
            "FOO=BAR BAZ",
          ],
          args: [],
        },
      },
    },
    {
      name: "with additional arguments specified",
      inputs: { args: `-Wdev -Wdeprecated\n--fresh --foo "bar baz"` },
      expectedContext: {
        configure: {
          generator: "",
          options: [],
          args: ["-Wdev", "-Wdeprecated", "--fresh", "--foo", "bar baz"],
        },
      },
    },
    {
      name: "with run build specified",
      inputs: { "run-build": "true" },
      expectedContext: { build: { enabled: true, args: [] } },
    },
    {
      name: "with additional build arguments specified",
      inputs: { "build-args": `--target foo\n--parallel  8 --foo "bar baz"` },
      expectedContext: {
        build: {
          enabled: false,
          args: ["--target", "foo", "--parallel", "8", "--foo", "bar baz"],
        },
      },
    },
    {
      name: "with all specified",
      inputs: {
        "source-dir": "project",
        "build-dir": "output",
        generator: "Ninja",
        "c-compiler": "clang",
        "cxx-compiler": "clang++",
        "c-flags": "-Werror -Wall\n-Wextra",
        "cxx-flags": "-Werror -Wall\n-Wextra  -Wpedantic",
        options: `BUILD_TESTING=ON BUILD_EXAMPLES=ON\nBUILD_DOCS=ON "FOO=BAR BAZ"`,
        args: `-Wdev -Wdeprecated\n--fresh --foo "bar baz"`,
        "run-build": "true",
        "build-args": `--target foo\n--parallel  8 --foo "bar baz"`,
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
            "FOO=BAR BAZ",
          ],
          args: ["-Wdev", "-Wdeprecated", "--fresh", "--foo", "bar baz"],
        },
        build: {
          enabled: true,
          args: ["--target", "foo", "--parallel", "8", "--foo", "bar baz"],
        },
      },
    },
  ];

  for (const testCase of testCases) {
    it(`should get the action context ${testCase.name}`, async () => {
      const { getInput } = await import("gha-utils");
      const { getContext } = await import("./context.js");

      const inputs = testCase.inputs || {};
      jest.mocked(getInput).mockImplementation((name) => {
        return inputs[name] || "";
      });

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
    });
  }
});
