import { test, expect } from '@playwright/test'
import { login } from './utils'

test.describe('cotações', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/app/cotacoes')
  })

  test('mostra o kanban com KPIs e as 6 colunas', async ({ page }) => {
    await expect(page.getByText('Total de Cotações')).toBeVisible()
    await expect(page.getByText('Aguardando Resposta')).toBeVisible()
    await expect(page.getByText('Valor Total')).toBeVisible()

    // maiúsculas só via CSS text-transform; o texto real no DOM é capitalizado normal
    for (const label of ['Nova', 'Em Atendimento', 'Proposta Enviada', 'Aguardando Cliente', 'Aprovada', 'Perdida']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
  })

  test('arrasta um card de Nova para Em Atendimento (view -> hook -> service -> adapter)', async ({ page }) => {
    const novaColumn = page.getByTestId('kanban-column-nova')
    const targetColumn = page.getByTestId('kanban-column-em_atendimento')

    const card = novaColumn.locator('[data-testid^="quote-card-"]').first()
    const code = await card.locator('span.font-mono').textContent()

    const cardBox = await card.boundingBox()
    const targetBox = await targetColumn.boundingBox()
    if (!cardBox || !targetBox) throw new Error('Elemento do Kanban sem bounding box')

    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 40, { steps: 10 })
    await page.mouse.up()

    await expect(targetColumn.getByText(code ?? '')).toBeVisible()
    await expect(novaColumn.getByText(code ?? '')).toHaveCount(0)
  })

  test('cria uma cotação pelo modal "Nova Cotação" (lead digitado, com telefone)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nova Cotação' }).first().click()

    const dialog = page.getByRole('dialog', { name: 'Nova Cotação' })
    await dialog.getByRole('button', { name: 'Digitar' }).click()

    // Telefone e e-mail ficam visíveis nos dois modos (Buscar Cliente e
    // Digitar), não só quando um cliente é selecionado via busca.
    await expect(dialog.getByText('+55')).toBeVisible()
    await expect(dialog.getByPlaceholder('(11) 91234-5678')).toBeVisible()
    await expect(dialog.getByPlaceholder('email@exemplo.com')).toBeVisible()

    const leadName = `Lead E2E ${Date.now()}`
    await dialog.getByPlaceholder('Nome completo *').fill(leadName)
    await dialog.getByPlaceholder('(11) 91234-5678').fill('11912345678')
    await dialog.getByRole('button', { name: 'Criar Cotação' }).click()

    await expect(page.getByText('Cotação criada.')).toBeVisible()
    await expect(dialog).not.toBeVisible()

    const novaColumn = page.getByTestId('kanban-column-nova')
    await expect(novaColumn.getByText(leadName)).toBeVisible()
    await expect(novaColumn.getByText('11912345678')).toBeVisible()
  })

  test('"Buscar Cliente" seleciona um cliente existente (card com telefone/email)', async ({ page }) => {
    // client-1 do seed espelha a referência real: Leandro Theodoro Nascimento,
    // telefone (10) 09103-7736, email leandro_contato@live.com. Comportamento
    // confirmado ao vivo em fixpass.com.br/app/cotacoes: "Buscar Cliente" é só
    // busca — ao selecionar, vira um card do cliente (sem campos editáveis).
    await page.getByRole('button', { name: 'Nova Cotação' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Nova Cotação' })

    // modo padrão já é "Buscar Cliente"
    await expect(dialog.getByText('Lead', { exact: true })).toBeVisible()
    await dialog.getByPlaceholder('Buscar cliente por nome, email ou telefone...').fill('Leandro Theodoro')
    // maiúsculas só via CSS text-transform; o texto real no DOM é capitalizado normal
    await dialog.getByText('Leandro Theodoro Nascimento').click()

    // rótulo da seção muda pra "Cliente" e mostra o card selecionado
    await expect(dialog.getByText('Cliente', { exact: true })).toBeVisible()
    await expect(dialog.getByText('(10) 09103-7736 · leandro_contato@live.com')).toBeVisible()

    await dialog.getByRole('button', { name: 'Criar Cotação' }).click()
    await expect(page.getByText('Cotação criada.')).toBeVisible()
  })
})
