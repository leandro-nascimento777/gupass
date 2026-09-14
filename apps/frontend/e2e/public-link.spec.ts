import { test, expect } from '@playwright/test'
import { login } from './utils'

test.describe('link público de clientes', () => {
  test('admin cria link gerenciável e gera link temporário', async ({ page }) => {
    await login(page)
    await page.goto('/app/clientes/public-link')

    await expect(page.getByText('Link fixo da sua agência. Sempre acessível.')).toBeVisible()

    // Link gerenciável
    await page.getByRole('button', { name: 'Novo Link' }).click()
    await page.getByLabel('Nome *').fill('Representante João')
    await page.getByRole('button', { name: 'Criar Link' }).click()
    await expect(page.getByText('Link criado.')).toBeVisible()
    await expect(page.getByText('Representante João')).toBeVisible()
    await expect(page.getByText('(1/5)')).toBeVisible()

    // Link temporário
    await page.getByRole('button', { name: 'Gerar Link' }).click()
    await expect(page.getByText(/Expira em/)).toBeVisible()
  })

  test('página pública resolve o link permanente e completa o cadastro', async ({ page }) => {
    // sem login: rota pública, fora do RequireAuth
    await page.goto('/cliente/vai-de-tur-b9e60354')

    await expect(page.getByRole('heading', { name: 'Vai de Tur' })).toBeVisible()
    await expect(page.getByText('Preencha seus dados para completar o cadastro.')).toBeVisible()

    await page.getByLabel('Nome Completo *').fill(`Cliente Público ${Date.now()}`)
    await page.getByRole('button', { name: 'Próximo' }).click()
    await page.getByRole('button', { name: 'Próximo' }).click()
    await page.getByRole('button', { name: 'Próximo' }).click()
    await page.getByRole('button', { name: 'Concluir Cadastro' }).click()

    await expect(page.getByRole('heading', { name: 'Cadastro recebido!' })).toBeVisible()
  })

  test('link para slug inexistente mostra estado de inválido', async ({ page }) => {
    await page.goto('/cliente/slug-que-nao-existe')
    await expect(page.getByText('Link inválido ou expirado')).toBeVisible()
  })
})
