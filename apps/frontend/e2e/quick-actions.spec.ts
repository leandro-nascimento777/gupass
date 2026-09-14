import { test, expect } from '@playwright/test'
import { login } from './utils'

/**
 * Os atalhos da QuickActionsBar (Novo Bilhete/Cliente/Cotação/Venda) precisam
 * abrir o modal/painel correspondente por cima da tela atual — nunca navegar
 * para uma página (ver referência real e ARCHITECTURE.md). Este teste existe
 * porque essa é exatamente a regressão que corrigimos.
 */
test.describe('quick actions', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Novo Bilhete abre um painel lateral sem navegar', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo Bilhete' }).click()
    await expect(page.getByRole('dialog', { name: 'Novo Bilhete' })).toBeVisible()
    await expect(page).toHaveURL(/\/app$/)
  })

  test('Novo Cliente abre o wizard completo sem navegar', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo Cliente' }).click()
    await expect(page.getByRole('dialog', { name: 'Novo Cliente' })).toBeVisible()
    await expect(page).toHaveURL(/\/app$/)
  })

  test('Nova Cotação abre um dialog sem navegar', async ({ page }) => {
    await page.getByRole('button', { name: 'Nova Cotação' }).click()
    await expect(page.getByRole('dialog', { name: 'Nova Cotação' })).toBeVisible()
    await expect(page).toHaveURL(/\/app$/)
  })

  test('Nova Venda abre um dialog sem navegar', async ({ page }) => {
    await page.getByRole('button', { name: 'Nova Venda' }).click()
    await expect(page.getByRole('dialog', { name: 'Nova Venda' })).toBeVisible()
    await expect(page).toHaveURL(/\/app$/)
  })
})
