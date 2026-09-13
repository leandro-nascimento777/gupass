import { defineConfig, devices } from '@playwright/test'

/**
 * Roda contra o servidor de dev (`vite`), não contra o build de produção:
 * o mock de API (MSW, ver src/main.tsx) só liga quando `import.meta.env.DEV`
 * é true, e isso exige o dev server — `vite preview` serve o build e não tem mock.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
})
