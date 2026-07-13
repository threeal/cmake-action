import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ["text"],
      thresholds: { 100: true },
    },
  },
});
