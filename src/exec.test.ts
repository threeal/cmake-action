import { logCommand } from "gha-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exec } from "./exec.js";

describe("execute commands", () => {
  vi.mock("gha-utils", () => ({
    logCommand: vi.fn<(command: string, ...args: string[]) => void>(),
  }));

  beforeEach(() => {
    vi.mocked(logCommand).mockClear();
  });

  it("should successfully execute a command", async () => {
    await exec("node", ["--version"]);

    expect(logCommand).toHaveBeenCalledTimes(1);
    expect(logCommand).toHaveBeenCalledWith("node", "--version");
  });

  it("should fail to execute a command", async () => {
    await expect(exec("node", ["--invalid"])).rejects.toThrow(
      "Command exited with status code 9",
    );

    expect(logCommand).toHaveBeenCalledTimes(1);
    expect(logCommand).toHaveBeenCalledWith("node", "--invalid");
  });
});
