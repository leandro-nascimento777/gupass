import { test, expect } from '@playwright/test'
import { login } from './utils'

test.describe('autenticação', () => {
  test('usuário não autenticado é redirecionado para /login', async ({ page }) => {
    await page.goto('/app')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('login com qualquer credencial leva ao dashboard', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL(/\/app$/)
    await expect(page.getByRole('heading', { name: 'Painel Operacional' })).toBeVisible()
  })

  test('sair da conta desloga e volta para /login', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'Minha conta' }).click()
    await page.getByText('Sair da conta').click()
    await expect(page).toHaveURL(/\/login$/)

    // garante que a sessão foi mesmo encerrada, não só a navegação
    await page.goto('/app')
    await expect(page).toHaveURL(/\/login$/)
  })
})
