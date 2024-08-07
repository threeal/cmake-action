import path from "node:path";

export interface Context {
  sourceDir: string;
  buildDir: string;
  configure: {
    generator: string;
    options: string[];
    args: string[];
  };
  build: {
    enabled: boolean;
    args: string[];
  };
}

/**
 * Retrieves an action input.
 * @param key - The key of the action input.
 * @returns The action input value as a string.
 */
function getInput(key: string): string {
  const value = process.env[`INPUT_${key.toUpperCase()}`] || "";
  return value.trim();
}

export function getContext(): Context {
  const sourceDir = getInput("source-dir");
  const options: string[] = [];

  let input = getInput("c-compiler");
  if (input) options.push(`CMAKE_C_COMPILER=${input}`);

  input = getInput("cxx-compiler");
  if (input) options.push(`CMAKE_CXX_COMPILER=${input}`);

  input = getInput("c-flags");
  if (input) {
    const flags = input.replaceAll(/\s+/g, " ");
    options.push(`CMAKE_C_FLAGS=${flags}`);
  }

  input = getInput("cxx-flags");
  if (input) {
    const flags = input.replaceAll(/\s+/g, " ");
    options.push(`CMAKE_CXX_FLAGS=${flags}`);
  }

  input = getInput("options");
  if (input) {
    const opts = input.split(/\s+/).filter((arg) => arg != "");
    for (const opt of opts) {
      options.push(opt);
    }
  }

  return {
    sourceDir,
    buildDir: getInput("build-dir") || path.join(sourceDir, "build"),
    configure: {
      generator: getInput("generator"),
      options,
      args: getInput("args")
        .split(/\s+/)
        .filter((arg) => arg != ""),
    },
    build: {
      enabled: getInput("run-build") == "true",
      args: getInput("build-args")
        .split(/\s+/)
        .filter((arg) => arg != ""),
    },
  };
}
