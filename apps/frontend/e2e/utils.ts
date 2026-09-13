import type { Page } from '@playwright/test'

/**
 * Login mockado: qualquer credencial autentica (ver modules/auth/services/auth.service.ts).
 * Cada teste roda com storage state limpo (Playwright cria um novo contexto de
 * browser por teste), então sempre começa deslogado.
 */
export async function login(page: Page) {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill('leandro@gufly.com')
  await page.getByLabel('Senha').fill('qualquer-senha')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/app')
}
