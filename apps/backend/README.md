# backend (ainda não construído)

Pasta reservada para a API real do GuPass — construída depois do frontend,
mas **dentro deste mesmo repositório/projeto** (`gupass/`), como app irmão de
`apps/frontend/`, não como um projeto/repo separado.

Ela deve implementar o contrato REST já definido a partir do consumo do
frontend (endpoints, formatos de request/response, paginação):

- `../../docs/API_CONTRACT.md` — contrato de endpoints gerado a partir dos
  handlers mockados (MSW) do frontend.
- `../../docs/DOCUMENTACAO_TCC_FIXPASS.md` — regras de negócio e entidades
  (seção 16) que o frontend só espelha em `apps/frontend/src/types/entities.ts`,
  sem implementar.
- `../../docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md` — contexto original do
  projeto (seção 0): por que frontend e backend são desacoplados via HTTP,
  mesmo morando no mesmo repo.

Ao começar: seguir a mesma ideia de camadas do frontend (ver
`apps/frontend/ARCHITECTURE.md`) adaptada ao framework escolhido — algo como
controller/handler (equivalente à view) → service (regra de negócio de
verdade, que aqui SIM pode existir) → repository (adapter de persistência) —
para manter as duas metades do projeto com uma cara só, uma arquitetura só.
