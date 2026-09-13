# Arquitetura do frontend

Este documento descreve como o código é organizado dentro de cada módulo de
`src/modules/`. Vale para todo módulo que acessa dados (API real ou mock) —
é a resposta a "onde eu boto essa lógica?".

## Camadas (regra de dependência: só aponta para baixo)

```
View (pages/ e components/)
   ↓ usa
Hook (hooks/) — useQuery/useMutation, fininho, sem regra de negócio
   ↓ chama
Service (services/) — regra de aplicação, orquestração, mapeamento de forma
   ↓ chama
Adapter (adapters/) — única camada que conhece o formato HTTP do recurso
   ↓ chama
httpClient (lib/api/http-client.ts) — transporte, interceptado pelo MSW em dev
```

- **View nunca chama `httpClient`, adapter ou service diretamente** — só hooks.
  Se uma tela precisa buscar/gravar dado, o hook do módulo já existe ou é criado.
- **Hook não decide nada** — não mapeia payload, não escolhe qual campo vira o
  quê. Ele só liga React Query ao service e cuida de efeito colateral de UI
  (toast de sucesso/erro, invalidar cache).
- **Service não conhece React.** Poderia ser testado com `node --test` sem
  montar componente nenhum. É onde mora: montagem de payload a partir de um
  form (ex. `buildClientPayload`), simulação de consulta externa (ex.
  `lookupCpf`/`lookupCep`), qualquer orquestração de mais de um adapter.
- **Adapter só fala HTTP.** Um método por operação, tipos de entrada/saída,
  nada de lógica condicional de negócio.

> Regra do projeto (ver `docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md` seção 6): o
> frontend não implementa regra de negócio "de verdade" (cálculo de comissão,
> validação oficial de CPF/CNPJ, emissão fiscal etc.) — isso é do backend. O
> que vive no `service` é regra de **aplicação/apresentação**: como montar um
> payload, como simular um resultado, como orquestrar chamadas — não a regra
> de negócio em si.

## Exemplo de referência

`modules/clientes/` é a implementação completa do padrão:

```
modules/clientes/
  adapters/
    clients.adapter.ts             # fetch/create/update/delete via httpClient
    client-categories.adapter.ts
  services/
    clients.service.ts             # listClients, buildClientPayload, createClientFromWizard
    client-categories.service.ts
    document-lookup.service.ts     # simulação de consulta CPF/CNPJ/CEP
  hooks/
    useClients.ts                  # useQuery/useMutation chamando o service
    useClientCategories.ts
  validators/
    client.schema.ts               # zod, usados pelo React Hook Form
    client-category.schema.ts
  components/                      # peças de UI do módulo (dialogs, tabela...)
  pages/                           # telas roteadas
```

`modules/dashboard/` e `modules/assinatura/` seguem o mesmo padrão em menor
escala (um único recurso cada).

## Módulos ainda sem dado real

A maioria dos módulos (`bilhetes`, `cotacoes`, `financeiro/*`,
`configuracoes/*` etc.) hoje só renderiza `PlaceholderPage` — não existe
nenhuma chamada de API para organizar ainda, então eles não têm `adapters/`
nem `services/`. **Quando um desses módulos ganhar dado de verdade**, criar as
duas pastas seguindo exatamente o exemplo de `clientes/` acima, em vez de
chamar `httpClient`/mock direto da view ou de um hook "gordo".

## Autenticação (caso à parte)

`modules/auth/` usa a mesma ideia, trocando "adapter HTTP" por "adapter de
sessão" (`lib/stores/auth-store.ts`, um store Zustand persistido em
`sessionStorage` — está em `lib/` por ser consumido fora do módulo auth
também, ex. guarda de rota):

```
lib/stores/auth-store.ts        # adapter — só fala com sessionStorage
modules/auth/services/auth.service.ts   # authenticate()/endSession()
modules/auth/hooks/useAuth.ts           # estado reativo (isAuthenticated, user)
modules/auth/hooks/useLogin.ts          # ação de login + redirecionamento
modules/auth/hooks/useLogout.ts         # ação de logout + redirecionamento
```

Nenhum componente fora de `modules/auth/` importa `auth-store` diretamente —
todos usam `useAuth`/`useLogin`/`useLogout`.

## `lib/` — o que continua compartilhado de propósito

Fica em `lib/` (não pertence a nenhum módulo) o que é genuinamente
transversal: `http-client.ts` (transporte), `format.ts`/`utils.ts` (helpers
puros), `status-maps.ts` (mapeamento visual reusado por vários módulos),
`stores/ui-store.ts` (estado de UI global), `hooks/useTheme.ts`, e `mocks/`
(handlers MSW). `types/entities.ts` também fica global de propósito — é o
contrato espelhando a API real que o backend vai implementar (ver
`docs/API_CONTRACT.md`), não é responsabilidade de um módulo só.
