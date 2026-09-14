# Próximos Passos — GuPass

> Documento de retomada de trabalho. Atualizado ao final de cada sessão com o
> que foi feito e o que fica pendente, pra continuar de outra máquina sem
> precisar reconstruir o contexto do zero.

## Status geral (visão rápida)

- ✅ **Layout base** (`AppLayout`, `Topbar`, `QuickActionsBar`, roteamento).
- ✅ **Autenticação** mockada + guarda de rota.
- ✅ **Dashboard** — KPIs reais.
- ✅ **Clientes** — módulo fechado: listagem, wizard "Novo Cliente" (PF/PJ, 4
  passos), categorias, **Ficha do Cliente** (header + KPIs + histórico) e
  **Link Público** (link permanente, links gerenciáveis, temporários, tema,
  preview ao vivo, página pública `/cliente/:slug`).
- 🔶 **Cotações** — Kanban + Nova Cotação construídos e testados (ver seção
  abaixo pro que falta).
- ⬜ Resto dos módulos na ordem da spec (`docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md`
  seção 5): Bilhetes, Vendas, Financeiro, Contratos/Recibos, Excursões/
  Vouchers/Calendário/Tarefas, Configurações/Assinatura, Registros,
  Relatórios, páginas públicas.

Arquitetura do frontend (camadas View → Hook → Service → Adapter, convenção
de módulos): ver `apps/frontend/ARCHITECTURE.md`. Mapeamento tela-a-tela
detalhado: `docs/MAPEAMENTO_TELAS.md`. Contrato dos endpoints mockados:
`docs/API_CONTRACT.md`.

---

## O que falta em Cotações (próximo passo sugerido)

Feito e testado hoje: Kanban (6 colunas, KPIs, drag-and-drop com
`@dnd-kit`, atualização otimista, log de atividade ao mover card) e o modal
**Nova Cotação** (Buscar Cliente / Digitar), tudo validado contra
`fixpass.com.br/app/cotacoes` ao vivo (não só a captura estática).

Fica de fora, por escolha de escopo (não por esquecimento):

1. **Catálogo de Serviços** (`/app/cotacoes/catalog`) — hoje é
   `PlaceholderPage`. Sem referência visual capturada; a doc (seção 6.3)
   descreve só como "itens de serviço pré-cadastrados e reutilizáveis (nome,
   tipo, descrição, preço de custo/venda)".
2. **Link Público de Cotação** (`/app/cotacoes/public-link`) — hoje é
   `PlaceholderPage`. Tem referência visual capturada (mesma arquitetura do
   Link Público de Clientes: link permanente, gerenciáveis, temporários,
   tema/cor, preview), mas a **página pública em si** é diferente — não é o
   wizard PF/PJ, é um formulário de "que serviços você precisa?" (seleção de
   tipo de serviço) que joga a cotação direto na coluna "Nova". Dá pra
   reaproveitar bastante código do Link Público de Clientes (adapters/
   services/hooks seguem o mesmo formato), mas a UI da página pública em si
   precisa ser desenhada do zero.
3. **"Montar Proposta Comercial"** — é o que "Continuar para Proposta"
   levaria no app real (montagem de itens/serviços da cotação, cálculo de
   valor). Hoje o botão do nosso modal diz **"Criar Cotação"** em vez de
   "Continuar para Proposta" exatamente porque essa tela não existe ainda —
   criamos a cotação já em "Nova" com `totalValue: 0` e paramos aí.
   Referências: modal em `Dashboard 13：56：17`/`13：57：30`, documento final em
   `Proposta_COT-4688DF.pdf` (pasta `gupass-references/`).

Detalhes menores, decorativos (mesmo padrão do resto do app hoje, não é
regressão só daqui):

- Botão "Filtros" no Kanban não abre nada ainda.
- A busca do Kanban filtra por cliente/código, mas não por "destino" — o
  placeholder do campo menciona destino, só que `Quote` (`entities.ts`) não
  tem esse campo modelado ainda.

**Sugestão de próximo passo**: escolher uma dessas três peças (Catálogo,
Link Público de Cotação, ou Montar Proposta) pra fechar o módulo Cotações de
vez, ou seguir pro próximo módulo da ordem da spec (Bilhetes).

---

## Como retomar em outra máquina

```
git clone https://github.com/leandro-nascimento777/gupass.git
cd gupass
npm run dev          # delega pra apps/frontend (vite)
```

Pra rodar os testes antes de mexer em qualquer coisa (confirma que está tudo
verde):

```
npm run test:e2e     # ou: cd apps/frontend && pnpm exec playwright test
```

Node precisa ser `>=22.12.0` (ou `>=20.19.0`) — se o `npm run lint` falhar
com erro de binding nativo do oxlint, é isso; atualizar o Node resolve (ver
histórico do commit que corrigiu isso nesta máquina).

## Como validar contra a referência real

Duas fontes, cada uma com seu uso (ver `apps/frontend/ARCHITECTURE.md` não
cobre isso — é processo de trabalho, não arquitetura de código):

- **Arquivo `.html` capturado** (pasta `gupass-references/`, ou um novo que o
  usuário fornecer): bom pra layout/copy exatos, mas é uma foto congelada —
  cliques não trocam de aba, não abrem modal, etc.
- **Link ao vivo** (`fixpass.com.br/...`, aberto no Chrome do próprio
  usuário, já autenticado): melhor pra confirmar **comportamento** (troca de
  aba, o que aparece ao selecionar algo, larguras reais) — é o que revelou
  os ajustes de hoje no modal "Nova Cotação" (largura, campos por modo).

Regra fixada: **nunca aproximar/supor** o design ou comportamento de uma
tela que tem referência — inspecionar de verdade (estrutura + clicar nos
estados) antes de codar, e pedir o link/HTML/print quando não tiver
referência nenhuma.
