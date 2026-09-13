# GuPass

Clone funcional do FixPass (SaaS de gestão para agências de viagem),
desenvolvido como TCC. Um projeto só, um repositório só, uma arquitetura só —
frontend e backend são apps irmãos aqui dentro, não projetos separados.

```
gupass/
  apps/
    frontend/   # React + TS + Vite (existe hoje — ver apps/frontend/ARCHITECTURE.md)
    backend/    # API real (a construir depois — ver apps/backend/README.md)
  docs/         # documentação funcional e de planejamento do projeto
  gupass-references/
```

## Rodando o frontend

Da raiz do repositório:

```
npm run dev
```

(delega para `apps/frontend`, que usa pnpm internamente — ver
`apps/frontend/package.json`).

## Documentação

- `docs/DOCUMENTACAO_TCC_FIXPASS.md` — documento funcional completo (módulos,
  regras de negócio, fluxos, entidades).
- `docs/API_CONTRACT.md` — contrato REST entre frontend e backend.
- `docs/MAPEAMENTO_TELAS.md` — mapeamento tela → rota → módulo.
- `docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md` — spec original que guiou o
  scaffold do frontend.
- `apps/frontend/ARCHITECTURE.md` — como o código é organizado por dentro
  (camadas View → Hook → Service → Adapter).
