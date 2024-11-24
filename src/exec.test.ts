import { jest } from "@jest/globals";

describe("execute commands", () => {
  const logCommand = jest.fn<(command: string, ...args: string[]) => void>();
  jest.unstable_mockModule("gha-utils", () => ({ logCommand }));

  beforeEach(() => {
    logCommand.mockClear();
  });

  it("should successfully execute a command", async () => {
    const { exec } = await import("./exec.js");

    await exec("node", ["--version"]);

    expect(logCommand).toHaveBeenCalledTimes(1);
    expect(logCommand).toHaveBeenCalledWith("node", "--version");
  });

  it("should fail to execute a command", async () => {
    const { exec } = await import("./exec.js");

    await expect(exec("node", ["--invalid"])).rejects.toThrow(
      "Command exited with status code 9",
    );

    expect(logCommand).toHaveBeenCalledTimes(1);
    expect(logCommand).toHaveBeenCalledWith("node", "--invalid");
  });
});
