import { test, expect } from '@playwright/test'
import { login } from './utils'

test.describe('clientes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('lista clientes mockados (seed do MSW)', async ({ page }) => {
    await page.goto('/app/clientes')
    await expect(page.getByRole('table')).toBeVisible()
    // aguarda os skeletons de loading sumirem e ao menos uma linha real aparecer
    await expect(page.getByRole('row')).not.toHaveCount(0)
    await expect(page.getByText(/\d+ registro\(s\)/)).toBeVisible()
  })

  test('cria um cliente PF pelo wizard (view -> hook -> service -> adapter)', async ({ page }) => {
    await page.goto('/app/clientes')
    // A QuickActionsBar também tem um botão "Novo Cliente" (abre o mesmo modal
    // de qualquer tela) — pega o da própria página de Clientes, não o atalho.
    await page.getByRole('button', { name: 'Novo Cliente' }).last().click()

    const dialog = page.getByRole('dialog', { name: 'Novo Cliente' })
    await expect(dialog).toBeVisible()

    const nome = `Cliente E2E ${Date.now()}`
    await dialog.getByLabel('Nome Completo *').fill(nome)

    // Endereço -> Passaporte -> Dependentes: sem campo obrigatório, só avançar
    await dialog.getByRole('button', { name: 'Próximo' }).click()
    await dialog.getByRole('button', { name: 'Próximo' }).click()
    await dialog.getByRole('button', { name: 'Próximo' }).click()

    await dialog.getByRole('button', { name: 'Criar Cliente' }).click()

    await expect(page.getByText('Cliente cadastrado com sucesso.')).toBeVisible()
    await expect(dialog).not.toBeVisible()
    await expect(page.getByRole('link', { name: nome })).toBeVisible()
  })
})
