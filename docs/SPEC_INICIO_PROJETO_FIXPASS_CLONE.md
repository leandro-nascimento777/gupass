# Spec de Inicialização — Clone Funcional do FIXPASS (Frontend)
## Instruções para o Claude Code iniciar o projeto

> Cole este arquivo na raiz do repositório (ex. `PROJECT_SPEC.md` ou `CLAUDE.md`) antes de abrir o Claude Code, ou cole o conteúdo diretamente no chat como primeira instrução. Ele assume que você já tem, na raiz do projeto (ou em subpastas indicadas abaixo), os dois insumos principais:
>
> 1. `./referencia-html/` → pasta com os arquivos HTML/CSS capturados via Single File de todas as telas do FIXPASS.
> 2. `./DOCUMENTACAO_TCC_FIXPASS.md` → o documento funcional completo (módulos, regras de negócio, fluxos, entidades).
>
> Ajuste os caminhos abaixo se os nomes/pastas reais forem diferentes — a primeira tarefa do Claude é justamente localizar e confirmar esses arquivos.

---

## 0. Contexto do projeto

Este é o **frontend** de um clone funcional do sistema FIXPASS (SaaS de gestão para agências de viagem), desenvolvido como Trabalho de Conclusão de Curso (TCC). O **backend será construído separadamente, à mão, seguindo estritamente `DOCUMENTACAO_TCC_FIXPASS.md`** — portanto o frontend deve ser construído de forma **desacoplada**, consumindo uma API REST (ainda não existente) através de uma camada de client HTTP isolada, nunca com lógica de negócio hardcoded que deveria viver no backend.

O objetivo do frontend é **reproduzir fielmente a experiência visual e funcional das telas capturadas**, mas com código novo, organizado e componentizado — não é para copiar o HTML gerado pelo Single File, que é apenas referência visual (ele tem classes, ids e estrutura de build tool de terceiros, não deve ser reaproveitado literalmente).

---

## 1. Stack definida

- **Build tool / framework**: Vite + React 18 + TypeScript (strict mode).
- **Estilização**: TailwindCSS + shadcn/ui (componentes acessíveis, copiáveis, fáceis de customizar com as cores de marca por agência).
- **Roteamento**: React Router v6 (rotas aninhadas, para refletir o sitemap da seção 3 da documentação).
- **Data fetching / cache**: TanStack Query (React Query) — todo acesso a dados do "backend" passa por hooks de query/mutation, nunca fetch solto em componente.
- **Estado global leve** (UI state, não dados de servidor): Zustand.
- **Formulários e validação**: React Hook Form + Zod (schemas de validação compartilháveis e fáceis de mapear para os campos documentados, ex. wizard de Cliente e de Venda).
- **Tabelas**: TanStack Table (para as inúmeras listagens com colunas configuráveis: Vendas, Transações, Contas a Pagar, etc.).
- **Gráficos**: Recharts (para os widgets de Dashboard/Painel Financeiro).
- **Gerenciador de pacotes**: pnpm.
- **Mock de API**: enquanto o backend real não existe, usar **MSW (Mock Service Worker)** para simular os endpoints REST — isso permite validar todos os fluxos de tela sem depender do backend estar pronto, e depois é só trocar a baseURL/handlers reais.

---

## 2. Tarefa 1 — Reconhecimento (fazer ANTES de escrever qualquer código)

1. Ler `./DOCUMENTACAO_TCC_FIXPASS.md` por completo.
2. Listar todos os arquivos dentro de `./referencia-html/` (ou pasta equivalente que você encontrar — procure por arquivos `.html` na raiz e subpastas) e montar uma tabela de correspondência: **arquivo HTML → rota da aplicação → módulo da documentação**, usando o sitemap da seção 3 do documento como guia (ex. `dashboard.html` → `/dashboard` → Módulo Dashboard, seção 4).
3. Para cada arquivo HTML, abrir e extrair: estrutura visual (layout, componentes visuais únicos, ex. Kanban de cotações, wizard de steps, cards de KPI), paleta de cores usada, tipografia, ícones (identificar biblioteca de ícones usada, ex. lucide/heroicons, para adotar equivalente em shadcn).
4. Produzir um arquivo `MAPEAMENTO_TELAS.md` com essa tabela + observações de qualquer tela referenciada na documentação mas que **não tenha HTML capturado** (para eu saber que preciso desenhar do zero com base só na descrição funcional).
5. Não seguir para a Tarefa 2 sem antes me apresentar esse mapeamento para eu validar prioridades.

---

## 3. Tarefa 2 — Scaffold do projeto

1. Criar o projeto com Vite (`react-ts` template) + pnpm.
2. Instalar e configurar: TailwindCSS, shadcn/ui (init com tema base neutro, cores primária/secundária como CSS variables — devem ser trocáveis dinamicamente por agência, ver seção 11.1 da documentação), React Router, TanStack Query, TanStack Table, Zustand, React Hook Form + Zod, Recharts, MSW.
3. Estrutura de pastas sugerida (ajustar livremente, mas manter separação clara):

```
src/
  app/                 # setup de rotas, providers globais (QueryClient, Router, Theme)
  modules/             # um diretório por módulo de negócio (ver seção 3 da doc)
    dashboard/
    clientes/
    cotacoes/
    bilhetes/
    checkin/
    excursoes/
    vouchers/
    calendario/
    tarefas/
    financeiro/
      vendas/
      transacoes/
      metas/
      contas-a-pagar/
      contas-bancarias/
      comissoes/
      contratos/
      recibos/
      fiscal/
      relatorios/
    configuracoes/
    assinatura/
    registros/
    publico/           # páginas públicas sem login (cliente/:slug, cotacao/:slug)
  components/          # componentes de UI compartilhados (shadcn customizados)
  hooks/               # hooks reutilizáveis
  lib/
    api/               # client HTTP + um arquivo por recurso (clients.ts, quotes.ts, sales.ts...)
    mocks/             # handlers do MSW, espelhando os endpoints esperados do backend
    validators/        # schemas Zod compartilhados
  types/               # tipos TS das entidades (baseados na seção 16 da documentação)
  styles/
```

4. Cada módulo em `modules/<nome>/` deve conter, no mínimo: `pages/` (telas roteadas), `components/` (peças específicas do módulo, ex. `KanbanBoard.tsx` só existe em `cotacoes/`), `hooks/` (queries/mutations específicas do módulo).
5. Configurar roteamento completo espelhando o sitemap da seção 3.3/3.4 da documentação, incluindo rotas aninhadas de configurações e as páginas públicas fora do layout autenticado.
6. Criar um `AppLayout` com: menu superior (Dashboard, Emissões▾, Cadastro▾, busca CMD+K, notificações), sidebar completa (categorias: Principal, Financeiro, Conta) e um `AuthLayout` separado (para telas de login/páginas públicas).

---

## 4. Tarefa 3 — Camada de dados mockada (MSW)

1. Para cada entidade listada na seção 16 da documentação, criar um `handler` MSW com dados fake plausíveis (usar `@faker-js/faker`), respeitando os relacionamentos (ex. vendas referenciam clientes existentes).
2. Os endpoints mockados devem seguir uma convenção REST previsível (`GET /api/clients`, `POST /api/clients`, `GET /api/quotes?stage=nova`, etc.) — isso é o contrato que o backend real (feito à mão) vai precisar implementar depois. Documentar esse contrato à medida que for criado em `./API_CONTRACT.md` (gerar automaticamente, não pedir pro usuário escrever).
3. Simular paginação, filtros e erros ocasionais (para validar estados de loading/erro/empty na UI).

---

## 5. Tarefa 4 — Construção das telas (ordem de prioridade)

Seguir esta ordem (do mais simples/estrutural para o mais complexo), fechando um módulo por vez, incluindo estados vazio/erro/loading e responsividade mobile básica:

1. Layout base (AppLayout, Sidebar, Topbar, roteamento, tema claro, variáveis de cor de marca).
2. Autenticação (tela de login — mesmo mockada) + guarda de rota.
3. Dashboard (seção 4 da doc) — cards de KPI + filtros de período.
4. Clientes: listagem + wizard "Novo Cliente" (4 passos, PF/PJ) + categorias + ficha do cliente.
5. Cotações: Kanban de 6 estágios (drag-and-drop) + modal "Nova Cotação" + catálogo.
6. Bilhetes: listagem + modal "Novo Bilhete" (seleção de companhia → formulário) + Check-in.
7. Vendas: listagem + wizard de 5 passos (Cliente → Origem → Itens → Pagamento → Confirmar).
8. Financeiro restante: Transações, Contas a Pagar, Contas Bancárias, Comissões, Metas.
9. Contratos, Recibos (com os 6 templates visuais), Fiscal/NFS-e.
10. Excursões, Vouchers, Calendário, Tarefas.
11. Configurações (todas as abas da seção 11) e Assinatura/Planos (matriz de recursos por plano da seção 12, incluindo telas de "recurso bloqueado").
12. Central de Atividades (Registros) — feed de auditoria.
13. Relatórios (pelo menos os 2–3 relatórios sugeridos no MVP da seção 17; os demais podem ficar com UI pronta e "em breve").
14. Páginas públicas (`/cliente/:slug`, `/cotacao/:slug`) fora do layout autenticado, com o seletor de tema (Clássico/Aviação/Nuvens).

Sempre parar ao final de cada módulo, rodar o app, e pedir validação visual antes de seguir pro próximo.

---

## 6. Regras de implementação (aplicam-se ao projeto inteiro)

- **Nunca implementar regra de negócio "de verdade" no frontend** (cálculo de comissão, geração de PDF fiscal, validação de CPF/CNPJ oficial, etc.) — isso é responsabilidade do backend. O frontend apenas exibe o que a API retorna e envia inputs do usuário. Onde a API real ainda não existe, o mock deve simular o resultado, não a regra.
- Toda tela de listagem com muitos dados (Vendas, Transações, Contas, Bilhetes) deve ter: busca, filtros, paginação e (quando indicado na doc) seletor de colunas visíveis — usar TanStack Table para isso desde o início, não table HTML solta.
- Todo wizard multi-etapas (Cliente, Venda) deve manter estado entre etapas com uma única fonte de verdade (ex. Zustand store ou estado local do componente pai), permitir voltar sem perder dados preenchidos, e só disparar a mutation de criação na etapa final de confirmação.
- Toda mutation (criar/editar/excluir) deve invalidar as queries relacionadas (TanStack Query) para refletir na tela imediatamente.
- Componentes visuais únicos que aparecem em várias telas (badge de status, card de KPI, filtro de período Hoje/Ontem/Semana/Mês/Ano/Período) devem ser extraídos como componentes compartilhados desde a primeira vez que aparecerem, não duplicados.
- Cores de marca (primária/secundária) devem ser aplicadas via CSS custom properties setadas dinamicamente (simulando o "tema por agência" da seção 11.1), nunca hardcoded nos componentes.
- Acessibilidade básica: todo botão de ícone precisa de `aria-label`; modais devem ter foco preso (shadcn/Radix já cobre isso, não desabilitar).
- Não usar `localStorage`/`sessionStorage` para dados de negócio — apenas para preferências efêmeras de UI (ex. coluna de tabela recolhida), já que essas informações vão pertencer ao backend/usuário no sistema real.

---

## 7. Entregáveis esperados ao final de cada sessão de trabalho

- Código funcionando localmente (`pnpm dev`), sem erros de TypeScript.
- Atualização do `MAPEAMENTO_TELAS.md` marcando o que foi concluído.
- Atualização do `API_CONTRACT.md` com os endpoints mockados criados/alterados naquela sessão.
- Um resumo curto do que foi feito e o que falta, para eu repassar ao time de backend se necessário.

---

## 8. Primeira mensagem a enviar ao Claude Code

Copie e envie isto como primeiro prompt, ajustando os caminhos reais das pastas:

```
Leia este arquivo de spec por completo (SPEC_INICIO_PROJETO_FIXPASS_CLONE.md).
Depois:
1. Localize a pasta com os HTMLs capturados via Single File (pode estar em
   ./referencia-html, ./html, ./capturas ou nome similar — procure) e o arquivo
   DOCUMENTACAO_TCC_FIXPASS.md na raiz do projeto.
2. Execute a Tarefa 1 (reconhecimento) e me entregue o MAPEAMENTO_TELAS.md
   antes de escrever qualquer código.
Não pule a etapa de reconhecimento mesmo que pareça óbvio — preciso validar
o mapeamento tela-a-tela antes do scaffold.
```
