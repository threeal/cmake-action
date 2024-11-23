import { logCommand } from "gha-utils";
import { spawn } from "node:child_process";

/**
 * Executes a command with the given arguments.
 *
 * The command is executed with `stdin` ignored and both `stdout` and `stderr` inherited by the parent process.
 *
 * @param command The command to execute.
 * @param args The arguments to pass to the command.
 * @returns A promise that resolves when the command exits successfully or rejects if it exits with a non-zero status code or encounters an error.
 */
export async function exec(command: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    logCommand(command, ...args);
    const proc = spawn(command, args, {
      stdio: ["ignore", "inherit", "inherit"],
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with status code ${code}`));
      }
    });
  });
}
