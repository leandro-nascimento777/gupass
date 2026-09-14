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

    // KPIs financeiros no topo
    await expect(page.getByText('Faturamento (LTV)')).toBeVisible()
    await expect(page.getByText('Lucro Estimado')).toBeVisible()

    // abas de histórico presentes (contagem aparece junto do rótulo quando > 0)
    await expect(page.getByRole('tab', { name: 'Dados' })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Viagens/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Cotações/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Vendas/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Recibos/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Contratos/ })).toBeVisible()

    // aba "Dados" (default) mostra os 4 blocos de campos (texto em maiúsculas
    // só via CSS text-transform, o conteúdo real do DOM é "Dados Pessoais")
    await expect(page.getByText('Dados Pessoais')).toBeVisible()
    await expect(page.getByText('Contato', { exact: true })).toBeVisible()

    // Ações Rápidas
    await expect(page.getByRole('button', { name: 'Copiar Dados' })).toBeVisible()
  })

  test('ficha do cliente de referência bate com a captura real (dados + KPIs)', async ({ page }) => {
    // client-1 é semeado com os mesmos dados da referência real capturada
    // (Clientes - FixPass, Ficha do Cliente) — ver lib/mocks/seed.ts.
    await page.goto('/app/clientes/client-1/ficha')

    await expect(page.getByRole('heading', { name: 'Leandro Theodoro Nascimento' })).toBeVisible()
    // email e telefone aparecem tanto no header quanto no card "Contato" da aba Dados
    await expect(page.getByText('leandro_contato@live.com').first()).toBeVisible()
    await expect(page.getByText('(10) 09103-7736').first()).toBeVisible()
    await expect(page.getByText('Cliente desde set. de 2026')).toBeVisible()

    await expect(page.getByText('020.071.591-71')).toBeVisible() // CPF
    await expect(page.getByText('11/12/1987')).toBeVisible() // Nascimento (regressão de fuso horário)
    await expect(page.getByText('Masculino')).toBeVisible()

    await expect(page.getByText('Avenida José Carlos Amaral, 1244')).toBeVisible()
    await expect(page.getByText('Sumaré / SP')).toBeVisible()
    await expect(page.getByText('A123312B')).toBeVisible() // passaporte
  })

  test('cliente inexistente mostra estado de não encontrado', async ({ page }) => {
    await page.goto('/app/clientes/id-que-nao-existe/ficha')
    await expect(page.getByText('Cliente não encontrado.')).toBeVisible()
    await page.getByRole('link', { name: 'Voltar para Clientes' }).click()
    await expect(page).toHaveURL(/\/app\/clientes$/)
  })
})
