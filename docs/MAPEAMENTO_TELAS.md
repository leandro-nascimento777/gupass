# Mapeamento de Telas — FixPass Clone (TCC)

> Gerado na Tarefa 1 (Reconhecimento) da `SPEC_INICIO_PROJETO_FIXPASS_CLONE.md`, a partir da análise dos 80 arquivos HTML (Single File) em `./gupass-references/` + 2 PDFs de referência.

## Status de construção (Tarefa 4)

- ✅ **Layout base** (`AppLayout`, `AppSidebar`, `Topbar`, roteamento completo, tema com tokens da marca original, busca CMD+K) — construído em `fixpass-frontend/`.
- ✅ **Autenticação mockada** (`/login`) + guarda de rota (`RequireAuth`).
- ✅ **Dashboard** (seção 4) — KPIs reais consumindo `/api/dashboard` (MSW), filtro de período, toggle "Ocultar valores financeiros", gráfico de Fluxo de Caixa, widget Últimas Emissões.
- 🚧 Todos os demais módulos têm rota navegável e página placeholder ("Em construção") — próximos na ordem da spec: **Clientes** (item 4).
- Ver `API_CONTRACT.md` para os endpoints mockados já disponíveis (cobrem quase todas as entidades da seção 16 da documentação).

## 0. Nota metodológica importante

O `<title>` da aba do navegador (e por tabela o **nome do arquivo**, gerado a partir dele) **não é confiável** para identificar o conteúdo real de cada captura: a SPA original não atualiza o `<title>` a cada navegação client-side, então dezenas de arquivos nomeados "Dashboard" ou "Relatórios" na verdade contêm outras telas (ex.: Painel Financeiro, Portal de Metas, Vouchers, o wizard completo de "Nova Venda") capturadas por cima ou em sequência de teste.

Por isso, o mapeamento abaixo foi feito pelo **conteúdo real** de cada arquivo — H1/H2 da tela, comentário `<!-- Page saved with SingleFile url: ... -->` (quando presente, é a fonte mais confiável pois registra a URL exata), textos de modais/dialogs abertos e labels de aba ativa — não pelo nome do arquivo.

Além disso, muitas capturas com o mesmo título são **frames sequenciais de um mesmo fluxo multi-step** (o usuário documentou o wizard passo a passo de propósito, conforme confirmado). Por isso, elas não são tratadas como "duplicatas a descartar", e sim como **referência de cada etapa** do wizard.

**Design tokens globais** (consistentes em praticamente todos os arquivos do app autenticado):
- Cor primária: `--brand-primary` = `#8ce600` (verde-limão) / `--brand-accent` = `#9efd38`
- Cor escura/marca: `--brand-dark` = `#1b004a` (navy)
- Superfícies: `--surface-body` = `#eff2f6`, `--surface-card` = `#ffffff`
- Texto: `--text-primary` = `#020617`
- Feedback: sucesso `#10b981`, erro/perigo `#ef4444`, aviso âmbar `#fbbf24`/`#f59e0b`
- Azul de apoio (gráficos/links): `#3b82f6`; verde WhatsApp: `#25D366`
- Cinzas neutros: `#e5e7eb`, `#9ca3af`
- **Ícones**: 100% Lucide (`lucide-react`) em toda a aplicação autenticada. O módulo Calendário usa também classes `fc-*` da biblioteca **FullCalendar**.
- **Tipografia**: sans-serif do sistema de design (peso black/bold nos headings, títulos de KPI em caixa alta).

**Nota sobre os PDFs de referência** (`Proposta_COT-4688DF.pdf`, `rascunho-voucher-VCH-FDD5C3.pdf`): usam uma paleta **diferente** (roxo/indigo ~`#5B57D1`) — isso é esperado e **confirma** a regra de negócio da seção 11.1 da documentação ("Cores da Marca" por agência): documentos voltados ao cliente final (proposta, voucher) usam as cores configuradas pelo tenant ("Vai de Tur"), não a paleta fixa da plataforma FixPass. Servem de referência visual para os componentes de **Proposta Comercial** e **Voucher**, que devem aceitar cor primária/secundária dinâmica via CSS custom properties.

---

## 1. Dashboard (`/app`) — seção 4

| Arquivo | Estado capturado | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：34：35).html` | **Tela base limpa**, sem overlay | ✅ Referência principal do Dashboard: H1 "Painel Operacional", 13 widgets (Últimas Emissões, Status das Cotações, Check-ins Pendentes, Taxa de Conversão, Vendas do Período, Ticket Médio, Faturamento, Receita Recebida, Contas a Pagar, Despesa Paga, Fluxo de Caixa, Transações em Atraso, Lucro Bruto), filtro de período com "Mês" ativo, botões Organizar/Personalizar/Ocultar valores financeiros |
| `Dashboard - FIXPASS (13：57：30).html` (+ 4 duplicatas: `13：57：48`, `13：57：56`, `13：58：08`, `13：58：18`) | Dashboard + modal **"Montar Proposta Comercial"** aberto | Tela de montagem de proposta a partir de uma cotação (fluxo Cotação → Proposta). Usar `13：57：30` como referência única, as 4 seguintes são idênticas |
| `Dashboard - FIXPASS (13：59：22).html` ⚠️ | Dashboard + modal de formulário (forma de pagamento + textarea observações) | **Arquivo de 33MB, anômalo** — uma única linha interna do arquivo tem ~32.9MB de conteúdo não identificado (não é imagem, não tem prefixo `data:base64` reconhecível). Título/H1/widgets idênticos aos demais. Usar com cautela; não precisa ser lido por completo — os campos relevantes (contador de caracteres "112/2000", opções de pagamento) já foram extraídos via grep |
| `Dashboard - FIXPASS (13：50：14).html` (+ duplicata `13：50：25`) | Dashboard + **drawer "Novo Bilhete"**, etapa de seleção de companhia, LATAM já marcada como selecionada | Ver detalhamento completo do wizard "Novo Bilhete" na seção 6 (arquivos "Bilhetes" têm a sequência completa e mais rica) |
| `Dashboard - FIXPASS (13：51：08).html` | Dashboard + **drawer "Novo Cliente"**, aba **Pessoa Física** | Campos: CPF, RG, Data Nascimento, Nome |
| `Dashboard - FIXPASS (13：51：17).html` | Dashboard + **drawer "Novo Cliente"**, aba **Pessoa Jurídica** | Campos: CNPJ, Razão Social, IE, IM, e-mail |
| `Dashboard - FIXPASS (13：52：31).html` | Dashboard + modal **"Novo Cliente"**, endereço (complemento) preenchido | Sequência de preenchimento do wizard interno de cliente |
| `Dashboard - FIXPASS (13：52：53).html` | idem, etapa dados de empresa (nome do responsável) | |
| `Dashboard - FIXPASS (13：53：06).html` | idem, aba pessoa física, campo nome vazio | |
| `Dashboard - FIXPASS (13：54：03).html` | idem, **sub-modal "Preencha o cadastro com o CPF"** | ✅ Único — autofill por CPF (Receita Federal/serviço terceiro, seção 5.2 da doc) |
| `Dashboard - FIXPASS (13：54：41).html` | idem, campo logradouro preenchido | |
| `Dashboard - FIXPASS (13：55：07).html` | idem, campo país/observações | |
| `Dashboard - FIXPASS (13：55：18).html` / `13：55：29` | idem, sem diferença adicional relevante | Redundantes entre si |
| `Dashboard - FIXPASS (13：55：44).html` (+ `13：56：03`) | Dashboard + modal **"Nova Cotação"** | ✅ Referência do modal de criação de cotação (seção 6.2 da doc) |
| `Dashboard - FIXPASS (13：56：17).html` | Dashboard + modal **"Montar Proposta Comercial"** (2ª ocorrência, estado inicial) | |
| `Dashboard - FIXPASS (14：02：29).html` (+ `14：03：07`, `14：03：23`, `14：04：45`) | Na verdade tela **Vouchers de Serviços** (`/app/vouchers`) vazia + modal **"Novo Voucher de Serviço"** | Ver seção 8 — mapeado como módulo Vouchers |
| `Dashboard - FIXPASS (14：03：54).html` | Vouchers + modal com seção extra **"Dados de Importação"** | ✅ Único |
| `Dashboard - FIXPASS (14：04：56).html` / `14：05：34` | Tela de **detalhe de Voucher** (`VCH-FDD5C3`), estado base | Botões Compartilhar/Editar/Cancelar/Excluir |
| `Dashboard - FIXPASS (14：05：13).html` | Detalhe de Voucher + dialog **"Finalize antes de enviar"** | ✅ Único |
| `Dashboard - FIXPASS (14：05：27).html` | Detalhe de Voucher + popover **"Notificações"** aberto | ✅ Único (referência do dropdown de notificações do topbar) |

**Telas que na verdade NÃO são Dashboard** (nome do arquivo genérico, conteúdo real diferente — ver módulos correspondentes abaixo):
`13：45：54` → Painel Financeiro · `13：46：33` → Metas · `13：46：49` → Contas a Pagar · `13：46：59` → Bancos · `13：47：41` → **Faturas** (ver Gaps/achados extras) · `13：48：04` → Comissões · `13：48：22` e `13：48：47` → Fiscal.

---

## 2. Painel Financeiro (`/app/painel-financeiro`) — seção 9.1

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：45：54).html` | `/app/painel-financeiro` | H1 "Painel Financeiro"; gráficos: "Fluxo de Caixa — Últimos 12 meses", "Formas pagas pelos clientes", "Receita por Tipo de Serviço" (Recharts) |

## 3. Metas (`/app/metas`) — seção 9.4

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：46：33).html` | `/app/metas` | Tela cheia (sem sidebar padrão) — wizard "Portal de Metas" → "Configurar Meta" ("Defina sua primeira meta de faturamento") |

## 4. Contas a Pagar (`/app/contas`) — seção 9.5

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：46：49).html` | `/app/contas` | H1 "Contas a Pagar"; estado vazio "Nenhuma conta encontrada" + CTA "Nova Conta" |

## 5. Contas Financeiras / Bancárias (`/app/bancos`) — seção 9.6

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：46：59).html` | `/app/bancos` | H1 "Contas Financeiras"; estado vazio |

## 6. Bilhetes (`/app/bilhetes`) — seção 7.1

| Arquivo | Estado capturado | Observações |
|---|---|---|
| `Bilhetes - FixPass (13：33：54).html` | Lista vazia, aba **Bilhetes** ativa | H3 "Nenhum bilhete encontrado"; banner âmbar "Seu e-mail ainda não foi verificado" (menciona o e-mail do usuário) |
| `Bilhetes - FixPass (13：35：52).html` | Modal **"Novo Bilhete"**, **etapa 1**: grade de 11 companhias (LATAM, GOL, AZUL, TAP, Air Europa, American, Copa, Air France, Iberia, Avianca, United) + tile **"Gerar com IA"** (badge "novo") | ✅ Referência principal da etapa 1 |
| `Bilhetes - FixPass (13：36：01).html` | Modal, **etapa 2**: formulário manual após selecionar LATAM | ✅ Form vazio |
| `Bilhetes - FixPass (13：36：24).html` | Etapa 2 + **popover de busca/criação de cliente** ("Nenhum cliente encontrado" + botão `Criar "lea"`) | ✅ Referência do combobox de cliente |
| `Bilhetes - FixPass (13：38：32).html` | Etapa 2 + **modal aninhado "Novo Fornecedor"** (campos Nome, Tipo com 11 opções: Agência Parceira, CIA Aérea Direta, Consolidadora, Cruzeiro, GDS, Hotel, Locadora, Operadora de Turismo, OTA/Plataforma, Seguradora, Transfer/Receptivo, Outros) | ✅ Referência de modal secundário reutilizável ("+ novo X" dentro de formulários) |
| `Bilhetes - FixPass (13：43：35).html` | Lista vazia, sem banner de e-mail | Redundante com `13：33：54` (mesma tela, banner já dispensado) — manter só uma como referência |
| `Bilhetes - FixPass (13：43：43).html` | `/app/bilhetes?tab=checkin` — aba **Check-in** ativa | H1 "Check-in"; estado vazio "Tudo em dia!" |

**Gap**: aba **"Regras tarifárias"** (3ª aba do módulo) e o fluxo real de **"Gerar com IA"** não foram capturados — apenas o tile de entrada. Também não há captura de bilhete com dados preenchidos/status (Confirmado/Erro) nem da ação "Retentar".

## 7. Check-in (`/app/checkin`)

Coberto dentro do arquivo `Bilhetes - FixPass (13：43：43).html` (aba Check-in do módulo Bilhetes) — estado vazio apenas. Sem captura de check-in com voos populados nem dos filtros (Pendentes/Agendados/Concluídos/Perdidos) em uso.

## 8. Vouchers (`/app/vouchers`) — seção 7.4 (BETA)

| Arquivo real | Estado capturado | Observações |
|---|---|---|
| `Dashboard - FIXPASS (14：02：29).html` (+ `14：03：07`, `14：03：23`, `14：04：45`) | Lista vazia ("Nenhum voucher encontrado") + modal **"Novo Voucher de Serviço"** | ✅ Referência principal |
| `Dashboard - FIXPASS (14：03：54).html` | idem + seção **"Dados de Importação"** expandida no modal | ✅ Único |
| `Dashboard - FIXPASS (14：04：56).html` / `14：05：34` | **Detalhe de voucher** `VCH-FDD5C3`, estado base | Ações: Compartilhar/Editar/Cancelar/Excluir |
| `Dashboard - FIXPASS (14：05：13).html` | Detalhe + dialog **"Finalize antes de enviar"** | ✅ Único |
| `Dashboard - FIXPASS (14：05：27).html` | Detalhe + popover **"Notificações"** | ✅ Único — referência do sino do topbar |

Complementar: `rascunho-voucher-VCH-FDD5C3.pdf` mostra o **documento final do voucher** (capa + página de confirmação com passageiros/serviços) gerado a partir dessa mesma referência (`VCH-FDD5C3`) — ótima referência de PDF de saída.

## 9. Calendário (`/app/calendario`) — seção 8.1

| Arquivo | Observações |
|---|---|
| `Calendário - FixPass (13：45：31).html` | Visão **Mês** ativa (biblioteca FullCalendar); filtros por tipo de evento com cor própria: Evento (indigo `#6366F1`), Tarefa (âmbar `#F59E0B`), Voo (azul `#3B82F6`), Serviços (ciano `#0EA5E9`) |

**Gap**: visões Semana/Dia/Lista não capturadas; não há captura com eventos populados (aniversários, voos, tarefas mirrored).

## 10. Tarefas (`/app/tarefas`) — seção 8.2

| Arquivo | Observações |
|---|---|
| `Tarefas - FixPass (13：45：41).html` | Kanban vazio — colunas "A Fazer" (cinza), "Em Progresso", "Concluído", cada uma com borda superior colorida + badge de contagem; KPIs Total de Tarefas / Vencidas |

## 11. Clientes (`/app/clientes`) — seção 5

| Arquivo | Rota real | Observações |
|---|---|---|
| `Clientes - FixPass (13：40：24).html` (+ dup. `13：43：55`) | `/app/clientes` | Lista vazia; busca "por nome, email ou documento" |
| `Clientes - FixPass (13：44：05).html` | `/app/clientes/categories` | H3 "Categorias de Clientes"; grid de cards **populado** (cores por categoria, ex. tag roxa) — ✅ referência rica |
| `Clientes - FixPass (13：44：17).html` | `/app/clientes/public-link` | ✅ **Peça mais rica do módulo**: seletor de tema (Clássico/Aviação/Nuvens) + ~20 swatches de cor nomeados; iframe de preview ao vivo do formulário público (`/cliente/vai-de-tur-b9e60354`) contendo o **wizard PF/PJ de 4 passos** (Dados Pessoais, Endereço, Passaporte, Dependentes) descrito na seção 5.2 da doc |

**Observação**: o wizard interno "Novo Cliente" (modal disparado pelo botão "Novo Cliente" da lista) **não** aparece aberto nos arquivos rotulados "Clientes" — ele está capturado nos arquivos rotulados "Dashboard" (seção 1 acima, `13：51：08` em diante). Não há gap real, só está sob outro nome de arquivo.

**Gap**: ficha do cliente (`/app/clientes/:id/ficha`) não foi capturada.

## 12. Cotações (`/app/cotacoes`) — seção 6

| Arquivo | Estado capturado | Observações |
|---|---|---|
| `Cotações - FixPass (13：44：54).html` (+ dup. `13：45：02`) | Kanban vazio, 6 colunas (Nova, Em Atendimento, Proposta Enviada, Aguardando Cliente, Aprovada, Perdida) | Banner "Preencha os dados essenciais da agência" |
| `Cotações - FixPass (13：45：17).html` | Kanban de fundo + **painel de Link Público** sobreposto | Link Permanente `https://fixpass.com.br/cotacao/vai-de-tur-b9e60354`, botões Copiar/Recarregar/Abrir/WhatsApp — mesma arquitetura do link público de Clientes (seção 6.4 da doc) |

**Complementar**: o modal **"Nova Cotação"** está nos arquivos "Dashboard" `13：55：44`/`13：56：03` (seção 1). O modal **"Montar Proposta Comercial"** (após aprovar/avançar uma cotação) está em `13：56：17`, `13：57：30` etc. E o documento final está em `Proposta_COT-4688DF.pdf`.

**Gap**: Catálogo de Serviços (`/app/cotacoes/catalog`) não foi capturado; cards do Kanban com dados reais não foram vistos (só board vazio).

## 13. Vendas (`/app/vendas`) — seção 9.2

| Arquivo | Estado capturado | Observações |
|---|---|---|
| `Vendas - FixPass (13：46：03).html` | Lista vazia | "Nenhuma venda encontrada / Crie sua primeira venda" |
| `Vendas - FixPass (14：02：13).html` | **Detalhe de venda** `VND-8F9137` | Seções H2: **Pagamentos**, **Itens da Venda**, **Nota Fiscal de Serviço (NFS-e)** ("Nenhuma nota fiscal emitida para esta venda") — ✅ referência única de detalhe |

**Wizard "Nova Venda" (5 passos) — capturado por engano nos arquivos "Relatórios"** (ver seção 15): Cliente → Itens e Valores → Pagamento (Pix/Cartão de Crédito/Transferência/Dinheiro) → Resumo da Venda (Confirmar) → tela de sucesso "Venda Cadastrada!". O passo **"Origem"** (2º dos 5 citados na doc) não foi identificado como tela distinta nas capturas — pode estar mesclado ao passo Cliente, ou não ter sido alcançado na sessão de captura.

## 14. Transações (`/app/transacoes`) — seção 9.3

| Arquivo | Observações |
|---|---|
| `Transações - FixPass (13：46：16).html` | Lista vazia; labels Entrada/Saída/Saldo |

## 15. Relatórios (`/app/relatorios`) — seção 9.12

| Arquivo | Estado capturado | Observações |
|---|---|---|
| `Relatórios - FixPass (13：49：03).html` | Tela de seleção, nada escolhido | H3 "Selecione um relatório" |
| `Relatórios - FixPass (13：49：18).html` | Card "Vendas por Período" selecionado | |
| `Relatórios - FixPass (13：49：25).html` | Card "Por Tipo de Serviço" selecionado | |
| `Relatórios - FixPass (13：49：40).html` | Card "Por Companhia Aérea" selecionado | |
| `Relatórios - FixPass (14：00：10).html` (+ dup. `14：00：24`, `14：00：37`) | Fundo de Relatórios + **modal "Nova Venda"**, passo **Cliente** | ✅ Wizard de Vendas, etapa 1 |
| `Relatórios - FixPass (14：00：52).html` (+ dup. `14：01：11`) | Wizard, passo **"Itens e Valores"** | ✅ Etapa 2/3 |
| `Relatórios - FixPass (14：01：31).html` | Wizard, passo **"Pagamento"** | ✅ Opções Pix/Cartão de Crédito/Transferência/Dinheiro |
| `Relatórios - FixPass (14：01：46).html` | Wizard, passo **"Resumo da Venda"** (Confirmar) | ✅ |
| `Relatórios - FixPass (14：01：57).html` | **Tela de sucesso** "Venda Cadastrada!" | ✅ |

**Nenhum relatório foi de fato gerado** em nenhuma das 12 capturas (sem `<table>`/gráfico de resultado renderizado) — só a tela de seleção de categoria/tipo.

## 16. Contratos (`/app/contratos`) — seção 9.9

| Arquivo | Observações |
|---|---|
| `Contratos - FixPass (13：47：11).html` | Lista vazia; KPIs Total/Pendentes/Assinados |

**Gap**: Modelos (`/app/contratos/templates`) não capturado; fluxo de assinatura digital não capturado.

## 17. Recibos (`/app/recibos`) — seção 9.10

| Arquivo | Observações |
|---|---|
| `Recibos - FixPass (13：47：27).html` | Lista vazia; botão "Novo Recibo", filtro "Modelo" |

**Gap importante**: os **6 templates visuais** (Clássico, Moderno, Minimalista, Executivo, Compacto, Premium) citados na doc **não aparecem renderizados** em nenhuma captura — será preciso desenhá-los só com base na descrição funcional (seção 9.10 da doc).

## 18. Comissões (`/app/comissoes`) — seção 9.7

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：48：04).html` | `/app/comissoes` | Lista vazia "Nenhuma comissão encontrada" |

## 19. Fiscal / NFS-e (`/app/fiscal`) — seção 9.11

| Arquivo real | Rota | Observações |
|---|---|---|
| `Dashboard - FIXPASS (13：48：22).html` | `/app/fiscal`, aba Notas Fiscais | Lista vazia "Nenhuma nota fiscal encontrada" |
| `Dashboard - FIXPASS (13：48：47).html` | `/app/fiscal`, aba **Configuração Fiscal** | H3 "Dados do Prestador (Agência)": campos CNPJ do Emissor, Razão Social, Inscrição Municipal |

## 20. Configurações (`/app/configuracoes`) — seção 11

| Arquivo | Aba real (via URL) | Observações |
|---|---|---|
| `Configurações - FixPass (13：41：00).html` | **Agência** (rota raiz/default) | H2 "Dados da Agência": Logo, Identificação, Contato e Endereço, Presença Digital, Cores da Marca, Assinatura Digital, Personalização de Documentos |
| `Configurações - FixPass (13：41：11).html` | **Meu Perfil** (`/profile`) | H3 "Dados Pessoais", H3 "Alertas via Telegram" |
| `Configurações - FixPass (13：41：19).html` | **Equipe** (`/users`) | Botão "Convidar Usuário" |
| `Configurações - FixPass (13：40：34).html` (+ dup. `13：41：28`) | **Fornecedores** (`/fornecedores`) | H3 "Fornecedores por Tipo", H3 "Top 10 Fornecedores por Receita"; lista vazia |
| `Configurações - FixPass (13：41：41).html` | **Email** (`/email`) | H2 "E-mail de Envio", H2 "Conta de Envio"; SMTP |
| `Configurações - FixPass (13：41：58).html` | **Notificações** (`/notifications`) | H2 "Preferências de Notificação"; Notificações no Navegador, Sistema, Voos, Antecedência do Check-in, Alertas via Telegram |
| `Configurações - FixPass (13：42：13).html` | **Comissões** (`/comissoes`) | H2 "Comissões", H3 "Configurações"; taxa percentual global |
| `Configurações - FixPass (13：42：25).html` | **WhatsApp** (`/whatsapp-templates`) | Os 5 templates da doc (Confirmação de Venda, Envio de Bilhete, Envio de Link de Assinatura, Envio de Proposta, Lembrete de Voo), todos "Ativo" |
| `Configurações - FixPass (13：42：40).html` | **Segurança** (`/security`) | H2 "Alterar Senha", H2 "Atividade Recente", H3 "💡 Dicas de Segurança" |

✅ Cobertura completa das 9 abas do módulo (contando Fornecedores 1x).

---

## 21. Gaps — telas da documentação SEM captura HTML

Não há nenhum arquivo capturado para:
- **Excursões** (`/app/excursoes`) — módulo inteiro sem referência visual
- **Afiliados** (`/app/afiliados`) — esperado, recurso bloqueado no plano teste
- **Importações** (`/app/importacoes`) — esperado, recurso bloqueado no plano teste
- **Assinatura/Planos** (`/app/assinatura`) — sem captura
- **Central de Atividades/Registros** (`/app/registros`) — sem captura (o log de auditoria em si)
- **Tela de Login/autenticação** — sem captura (natural, todas as capturas são pós-login)
- **Páginas públicas standalone** (`/cliente/:slug`, `/cotacao/:slug` acessadas diretamente, fora do preview embutido em iframe) — só vistas via preview dentro de `Clientes - public-link`
- **Ficha do Cliente** (`/app/clientes/:id/ficha`)
- **Catálogo de Serviços de Cotações** (`/app/cotacoes/catalog`)
- **Modelos de Contrato** (`/app/contratos/templates`) e fluxo de assinatura digital
- **6 templates visuais de Recibos** (só a lista vazia foi capturada)
- **Aba "Regras tarifárias"** de Bilhetes, e o fluxo completo de "Gerar com IA"
- Views Semana/Dia/Lista do Calendário

Essas telas precisarão ser desenhadas só com base na documentação funcional (`DOCUMENTACAO_TCC_FIXPASS.md`), sem referência visual direta.

## 22. Achado extra — tela não prevista na documentação

- **"Faturas"** (`Dashboard - FIXPASS 13：47：41`) — H1 "Faturas", estado vazio "Nenhum resultado encontrado". Não consta no sitemap da seção 3 nem na lista de módulos da documentação.
  **Decisão (validada):** fora de escopo por enquanto. Não entra na estrutura de rotas/módulos do scaffold nem no MVP.

---

## 23. Resumo de cobertura por módulo (para priorização da Tarefa 4)

| Módulo | Cobertura visual | Prioridade sugerida (spec, ordem) |
|---|---|---|
| Dashboard | ✅ Completa (base + Novo Bilhete/Novo Cliente/Nova Cotação overlays) | 3 |
| Clientes | ✅ Boa (lista, categorias, link público c/ wizard PF/PJ embutido) — falta ficha do cliente | 4 |
| Cotações | ✅ Boa (kanban vazio, link público, modal Nova Cotação, Montar Proposta) — falta catálogo e cards populados | 5 |
| Bilhetes | ✅ Muito boa (wizard completo passo a passo) — falta Regras Tarifárias e Gerar com IA | 6 |
| Check-in | ⚠️ Parcial (só estado vazio) | 6 |
| Vendas | ✅ Boa (lista vazia, detalhe, wizard completo de 5 passos) | 7 |
| Transações / Contas a Pagar / Bancos / Comissões | ⚠️ Parcial (todas só estado vazio) | 8 |
| Metas | ⚠️ Parcial (só wizard inicial) | 8 |
| Contratos / Recibos / Fiscal | ⚠️ Parcial (listas vazias; sem templates renderizados) | 9 |
| Excursões | ❌ Nenhuma | 10 |
| Vouchers | ✅ Boa (lista, modal, detalhe, dialogs, PDF final) | 10 |
| Calendário | ⚠️ Parcial (só visão Mês vazia) | 10 |
| Tarefas | ✅ Boa (kanban vazio completo) | 10 |
| Configurações | ✅ Completa (9/9 abas) | 11 |
| Assinatura/Planos | ❌ Nenhuma | 11 |
| Registros (auditoria) | ❌ Nenhuma | 12 |
| Relatórios | ⚠️ Parcial (só tela de seleção, nenhum resultado gerado) | 13 |
| Páginas públicas | ⚠️ Parcial (preview embutido apenas) | 14 |
