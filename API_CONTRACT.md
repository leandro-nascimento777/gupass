# API Contract — FixPass Clone (mock MSW)

> Gerado automaticamente à medida que os mocks são criados (ver
> `SPEC_INICIO_PROJETO_FIXPASS_CLONE.md`, Tarefa 3). Este é o contrato que o
> backend real (Nest, feito à parte) deve implementar — o frontend não conhece
> nem depende da implementação real, só deste formato de request/response.
>
> Implementação dos mocks: `fixpass-frontend/src/lib/mocks/` (`seed.ts` dados
> fake, `store.ts` estado mutável em memória, `handler-factory.ts` fábrica CRUD
> genérica, `handlers.ts` composição final).

## Convenções gerais

- Todas as rotas são prefixadas por `/api` (configurável via `VITE_API_BASE_URL`, ver `lib/api/http-client.ts`).
- Listagens retornam `{ data: T[], page: number, pageSize: number, total: number }`.
- Parâmetros de listagem: `page` (default 1), `pageSize` (default 20), `q` (busca textual, quando suportado) e filtros específicos por recurso (ver tabela).
- Mutations (`POST`/`PATCH`/`DELETE`) retornam o recurso atualizado (ou `204` sem corpo para `DELETE`).
- Erros retornam `{ message: string }` com status HTTP apropriado (`404` não encontrado, `500` simulação de falha de rede — ver `lib/mocks/config.ts`, `mockConfig.errorRate`, ajustável em runtime via `window.__mockConfig` no console do navegador).
- Todo recurso é implicitamente escopado a uma única agência mock (`agency-vai-de-tur`) — o backend real deve escopar por `agency_id` do usuário autenticado (ver doc funcional, seção 2).

## Autenticação

**Fora do escopo deste mock.** A tela de login (`/login`) aceita qualquer credencial e grava uma sessão local via `lib/stores/auth-store.ts` (zustand + sessionStorage, não é chamada de API). O backend real deve expor login/sessão real (JWT ou sessão) — o frontend precisará trocar essa store por chamadas HTTP reais quando o backend existir.

## Endpoints

| Recurso | Rota base | Filtros suportados | Busca (`q`) em |
|---|---|---|---|
| Dashboard (agregado) | `GET /api/dashboard?period=hoje\|ontem\|semana\|mes\|ano` | — | — |
| Agência | `GET/PATCH /api/agency` | — | — |
| Assinatura | `GET /api/subscription` | — | — |
| Planos | `/api/plans` (CRUD) | — | — |
| Membros da equipe | `/api/members` (CRUD) | — | name, email |
| Categorias de clientes | `/api/client-categories` (CRUD) | — | name |
| Clientes | `/api/clients` (CRUD) | `personType` | name, email, document |
| Cotações | `/api/quotes` (CRUD) | `stage` | clientName, code |
| Vendas | `/api/sales` (CRUD) | `status`, `paymentStatus` | clientName, code |
| Bilhetes | `/api/tickets` (CRUD) | `status`, `airline` | pnr, passengerLastName, code |
| Vouchers | `/api/vouchers` (CRUD) | `status` | clientName, code, title |
| Transações | `/api/transactions` (CRUD) | `type`, `status` | description, clientName |
| Contas a pagar | `/api/payables` (CRUD) | `status` | description |
| Contas bancárias | `/api/bank-accounts` (CRUD) | — | name, institution |
| Comissões | `/api/commissions` (CRUD) | `status`, `sellerId` | — |
| Metas | `/api/goals` (CRUD) | `month`, `year`, `ownerId` | — |
| Contratos | `/api/contracts` (CRUD) | `status` | clientName, code |
| Recibos | `/api/receipts` (CRUD) | — | clientName, code |
| Notas fiscais | `/api/fiscal-invoices` (CRUD) | `status` | — |
| Templates WhatsApp | `/api/whatsapp-templates` (CRUD) | — | name |
| Log de atividades | `/api/activity-log` (CRUD, só leitura na UI) | `category` | description, userName, entityRef |
| Fornecedores | `/api/suppliers` (CRUD) | `type`, `status` | name |
| Tarefas | `/api/tasks` (CRUD) | `status` | — |
| Eventos de calendário | `/api/calendar-events` (CRUD) | `type` | — |

Cada recurso "(CRUD)" expõe, via a fábrica genérica (`handler-factory.ts`):
- `GET /api/<recurso>` — lista paginada/filtrada
- `GET /api/<recurso>/:id` — um registro
- `POST /api/<recurso>` — cria (retorna `201`)
- `PATCH /api/<recurso>/:id` — atualiza parcialmente
- `DELETE /api/<recurso>/:id` — remove (retorna `204`)

## Formato `DashboardKpis` (`GET /api/dashboard`)

```ts
{
  period: string
  latestTickets: Array<{ id, airline, label, date, status }>
  quotesTotal: number
  quotesNew: number
  checkinsPending: number
  conversionRate: number          // %
  conversionFraction: [number, number]
  salesCount: number
  salesTotal: number
  averageTicket: number
  revenueBilled: number
  revenueReceived: number
  payablesTotal: number
  expensesPaid: number
  cashFlow: Array<{ date: string; income: number; expense: number }>
  overdueTransactionsCount: number
  overdueTransactionsTotal: number
  grossProfit: number
}
```

Ver `src/types/entities.ts` para o shape completo de todas as entidades (Agency,
Client, Quote, Sale, Ticket, Voucher, Transaction, Payable, BankAccount,
Commission, Goal, Contract, Receipt, FiscalInvoice, WhatsappTemplate,
ActivityLogEntry, Supplier, Plan, Subscription, Task, CalendarEvent).

## Pendências para o backend

- Autenticação/sessão real (login, refresh, logout).
- Nenhuma regra de negócio real está implementada nos mocks (cálculo de
  comissão, emissão de NFS-e, geração de PDF, integração com companhias
  aéreas, WhatsApp/Telegram, IA) — os mocks só simulam o *resultado* dos
  dados, nunca a regra (ver `SPEC_INICIO_PROJETO_FIXPASS_CLONE.md`, seção 6).
- Endpoints de upload (logo da agência, assinatura digital) ainda não
  modelados — a entrar quando as telas de Configurações/Agência forem
  construídas.
