import { defineConfig, devices } from '@playwright/test';

const apiBaseURL = process.env.QA_API_BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.PORTFOLIO_BASE_URL ?? 'https://pradyumnavissapragada.github.io',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000
  },
  webServer: {
    command: 'node src/mock-api/server.mjs',
    url: apiBaseURL + '/health',
    timeout: 15_000,
    reuseExistingServer: !process.env.CI,
    env: { QA_API_PORT: '4173' }
  },
  projects: [
    { name: 'chromium', testMatch: /.*\.ui\.spec\.ts$/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /.*\.ui\.spec\.ts$/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /.*\.ui\.spec\.ts$/, use: { ...devices['Desktop Safari'] } },
    { name: 'api', testMatch: /.*\.api\.spec\.ts$/, use: { baseURL: apiBaseURL } }
  ]
});
