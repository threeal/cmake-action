import { exec } from "./exec.js";

describe("execute commands", () => {
  it("should successfully execute a command", async () => {
    await exec("node", ["--version"]);
  });

  it("should fail to execute a command", async () => {
    await expect(exec("node", ["--invalid"])).rejects.toThrow(
      "Command exited with status code 9",
    );
  });
});
