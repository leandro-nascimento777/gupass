import { test, expect } from '@playwright/test'
import { login } from './utils'

test.describe('ficha do cliente', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('abre a partir da listagem e mostra dados + histórico', async ({ page }) => {
    await page.goto('/app/clientes')
    await expect(page.getByRole('table')).toBeVisible()

    const firstRowLink = page.getByRole('row').nth(1).getByRole('link').first()
    const clientName = await firstRowLink.textContent()
    await firstRowLink.click()

    await expect(page).toHaveURL(/\/app\/clientes\/.+\/ficha$/)
    await expect(page.getByRole('heading', { name: clientName ?? '', exact: true })).toBeVisible()

    // abas de histórico presentes (contagem entre parênteses no rótulo)
    await expect(page.getByRole('tab', { name: /Vendas \(\d+\)/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Cotações \(\d+\)/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Bilhetes \(\d+\)/ })).toBeVisible()
  })

  test('cliente inexistente mostra estado de não encontrado', async ({ page }) => {
    await page.goto('/app/clientes/id-que-nao-existe/ficha')
    await expect(page.getByText('Cliente não encontrado.')).toBeVisible()
    await page.getByRole('link', { name: 'Voltar para Clientes' }).click()
    await expect(page).toHaveURL(/\/app\/clientes$/)
  })
})
