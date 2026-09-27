import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/writing/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm exec tsx tests/writing/start-app.ts',
    url: 'http://127.0.0.1:3100/write',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
