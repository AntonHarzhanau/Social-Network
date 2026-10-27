import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:5173";
const apiOrigin = process.env.E2E_API_ORIGIN ?? "http://127.0.0.1:8000";

export default defineConfig({
  testDir: "../tests",
  fullyParallel: false,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "../playwright-report", open: "never" }],
  ],
  outputDir: "../test-results",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: process.env.E2E_EXTERNAL_SERVER === "1" ? undefined : {
    command: "npm run dev -- --host 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_API_BASE: "/api",
      VITE_MEDIA_BASE: "/media",
      VITE_MERCURE_URL: "/.well-known/mercure",
      VITE_DEV_API_TARGET: apiOrigin,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
