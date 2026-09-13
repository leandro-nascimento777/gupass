# Documentação Funcional — Sistema de Gestão para Agências de Viagem
## (Engenharia reversa funcional do FIXPASS — base para reprodução em TCC)

> Este documento descreve **o que o sistema precisa fazer** (requisitos funcionais, regras de negócio, fluxos, papéis, integrações e estrutura de dados) para que o produto seja reconstruído do zero, de forma independente do código original. Não contém HTML/CSS (que já foi capturado via Single File) — é o complemento funcional necessário para dar vida às telas.
>
> **Divisão de trabalho proposta:**
> - **Frontend** (feito com apoio do Claude): usa os arquivos HTML/CSS capturados como referência visual e este documento como referência funcional (estados, dados, validações, fluxos).
> - **Backend** (feito manualmente pelo aluno, seguindo estritamente este documento): API, banco de dados, autenticação, regras de negócio, integrações externas.

---

## 1. Visão Geral do Produto

O sistema é um **SaaS de gestão para agências de viagem (B2B/B2C)**, cobrindo o ciclo completo: captação de lead → cotação → venda → emissão de bilhete aéreo → check-in → pós-venda (voucher, contrato, recibo, nota fiscal) → financeiro (contas, comissões, metas) → relatórios gerenciais.

Características centrais:
- **Multi-tenant**: cada agência é um "tenant" isolado (dados, usuários, configurações, planos).
- **Multi-usuário com papéis/permissões** (Proprietário, Global, e outros papéis configuráveis).
- **Modelo de assinatura (SaaS)** com planos diferenciados por conjunto de funcionalidades e limites de uso (créditos de IA, nº de usuários, armazenamento).
- **Automação com IA** em pontos específicos (geração de bilhete a partir de texto colado, créditos de IA consumíveis).
- **Integrações externas**: WhatsApp (mensagens/suporte), Telegram (alertas pessoais), E-mail (SMTP customizável), Emissão de Nota Fiscal de Serviço eletrônica (NFS-e Nacional), companhias aéreas (retenção/consulta de PNR).
- **Páginas públicas** (sem login) para captação de clientes e cotações, com personalização visual por agência (tema, cor, link customizado e link temporário).

---

## 2. Papéis e Permissões (Multi-usuário)

- **Proprietário (Owner)**: acesso total, não pode ser removido, dono da assinatura.
- **Usuários da equipe**: convidados por e-mail (`Convidar Usuário`), com:
  - Função/cargo (role) definida por um sistema de **Permissões** configurável (tela "Permissões" dentro de Equipe).
  - Percentual de **Comissão individual** (sobrepõe a taxa global de comissões).
  - Status (Ativo/Inativo).
  - Data de entrada.
- Autenticação: login com e-mail/senha, com **e-mail de login imutável** (não pode ser alterado no perfil).
- Segurança: alteração de senha (senha atual + nova + confirmação), **log de atividade recente de login** com timestamp e IP (mín. últimos 5 acessos).
- Vínculo de **Telegram pessoal** (via deep-link ou código temporário) para notificações individuais de check-in.

### Regras de negócio (backend)
- Todo registro de dados (cliente, venda, bilhete, etc.) deve ser escopado por `agency_id` (tenant) — nenhuma query pode vazar dados entre agências.
- Toda ação de qualquer usuário deve gerar um evento no **log de atividades da agência** (ver seção 13 — Central de Atividades).
- Convite de usuário deve gerar token de convite por e-mail com expiração.

---

## 3. Estrutura de Navegação (Sitemap completo)

### 3.1 Menu superior
- **Dashboard** (`/app`)
- **Emissões** (dropdown): Bilhetes, Check-in, Excursões, Vouchers
- **Cadastro** (dropdown): Clientes, Fornecedores, Importações
- Busca global (CMD+K)
- Notificações (sino)
- Menu lateral completo (todas as seções abaixo)
- Suporte via WhatsApp (link fixo para número da FixPass)

### 3.2 Menu lateral completo (agrupado por seção, como aparece no produto)
**Ações rápidas**: Novo Bilhete, Novo Cliente, Nova Cotação, Nova Venda

**Principal**
- Dashboard (`/app`)
- Clientes (`/app/clientes`)
- Fornecedores (`/app/configuracoes/fornecedores`)
- Importações (`/app/importacoes`) — *recurso pago, bloqueado no plano teste*
- Cotações (`/app/cotacoes`)
- Calendário (`/app/calendario`)
- Tarefas (`/app/tarefas`)
- Bilhetes (`/app/bilhetes`)
- Check-in (`/app/checkin`)
- Excursões (`/app/excursoes`)
- Vouchers (`/app/vouchers`) — marcado como **BETA**

**Financeiro**
- Painel Financeiro (`/app/painel-financeiro`)
- Vendas (`/app/vendas`)
- Transações (`/app/transacoes`)
- Metas (`/app/metas`)
- Contas a Pagar (`/app/contas`)
- Contas Financeiras / bancárias (`/app/bancos`)
- Contratos (`/app/contratos`)
- Recibos (`/app/recibos`)
- Comissões (`/app/comissoes`)
- Afiliados (`/app/afiliados`) — *recurso pago, bloqueado no plano teste*
- Fiscal / NFS-e (`/app/fiscal`)
- Relatórios (`/app/relatorios`)

**Conta**
- Meu Perfil (`/app/configuracoes/profile`)
- Central de Atividades / Registros (`/app/registros`)
- Equipe (`/app/configuracoes/users`)
- Ajuda (`/ajuda`)
- Configurações (`/app/configuracoes`)
- Assinatura/Planos (`/app/assinatura`)
- Sair da conta (logout)

### 3.3 Sub-rotas identificadas
- `/app/clientes`, `/app/clientes/categories`, `/app/clientes/public-link`, `/app/clientes/:id/ficha`
- `/app/cotacoes`, `/app/cotacoes/catalog`, `/app/cotacoes/public-link`
- `/app/contratos`, `/app/contratos/templates`
- `/app/recibos`, `/app/recibos/modelos`
- `/app/configuracoes`, `/app/configuracoes/profile`, `/app/configuracoes/users`, `/app/configuracoes/fornecedores`, `/app/configuracoes/email`, `/app/configuracoes/notifications`, `/app/configuracoes/comissoes`, `/app/configuracoes/whatsapp-templates`, `/app/configuracoes/security`

### 3.4 Páginas públicas (sem autenticação)
- `https://fixpass.com.br/cliente/{slug-da-agencia}` — formulário público de cadastro de cliente
- `https://fixpass.com.br/cotacao/{slug-da-agencia}` — formulário público de solicitação de cotação
- Cada agência tem um **slug único** (ex.: `vai-de-tur-b9e60354`), usado para montar essas URLs

---

## 4. Módulo: Dashboard (`/app`)

Painel operacional com filtros de período (Hoje, Ontem, Semana, Mês, Ano, Período customizado) e opções de **Organizar/Personalizar** os cards exibidos (indica um dashboard configurável, drag-and-drop ou seleção de widgets).

### Widgets identificados
- **Últimas Emissões**: lista dos últimos bilhetes emitidos (companhia, localizador/nome, data/hora, status — ex. "Erro").
- **Status das Cotações**: total do mês, quantas são "novas".
- **Check-ins Pendentes**: contagem.
- **Taxa de Conversão**: % de cotações convertidas em venda, com fração (x de y).
- **Vendas do Período**: contagem + valor total vendido.
- **Ticket Médio**: valor médio por venda.
- **Faturamento**: total faturado no período.
- **Receita Recebida**: total efetivamente recebido (separado de faturado — indica regime de competência x caixa).
- **Contas a Pagar**: total pendente.
- **Despesa Paga**: total pago no período.
- **Fluxo de Caixa**: entradas x saídas (mini gráfico).
- **Transações em Atraso**: contagem + valor.
- **Lucro Bruto**: vendas − custo.
- Botão **"Ocultar valores financeiros"** — modo privacidade (mascara valores em R$ na tela, útil quando compartilhando tela).

### Regras de negócio
- Todos os KPIs recalculados conforme o filtro de período ativo.
- "Faturamento" ≠ "Receita Recebida" ⇒ o sistema distingue **valor lançado/contratado** de **valor efetivamente pago** (fluxo de caixa realizado vs. previsto).

---

## 5. Módulo: Clientes (CRM)

### 5.1 Listagem (`/app/clientes`)
- Busca por nome, email ou documento.
- Filtros avançados.
- Ordenação por coluna (ex. Nome).
- Colunas: Nome, Tipo (PF/PJ), Cidade/UF, Email, Telefone, Categorias, Data de cadastro.
- Ação por linha: copiar dado rápido, gerenciar categorias (tags), menu de contexto (editar/excluir/ver ficha).
- Paginação.

### 5.2 Cadastro de cliente — modal "Novo Cliente" (wizard de 4 passos)
Alterna entre **Pessoa Física** e **Pessoa Jurídica** (formulário muda de acordo).

1. **Dados Pessoais**
   - Atalho: preencher CPF e clicar "Preencher dados" → sistema consulta uma base (Receita Federal/serviço terceiro) e autocompleta nome, data de nascimento e sexo.
   - Campos: Nome completo, Email, Telefone (com seletor de código de país, padrão +55).
2. **Endereço**
   - CEP com preenchimento automático de endereço (integração tipo ViaCEP).
3. **Passaporte**
   - Dados de documento de viagem internacional (número, validade, país emissor, etc.).
4. **Dependentes**
   - Permite associar dependentes/acompanhantes ao cadastro principal (ex. família em uma mesma reserva).

### 5.3 Ficha do Cliente (`/app/clientes/:id/ficha`)
Página de detalhe consolidando histórico do cliente: vendas, cotações, contratos, vouchers, bilhetes associados (conforme referenciado em "Histórico do Cliente" nos relatórios).

### 5.4 Categorias de Clientes (`/app/clientes/categories`)
- CRUD simples de tags/categorias (ex.: Corporativo, Individual, VIP) com nome + descrição opcional.
- Usadas para segmentar clientes na listagem e em relatórios ("Por Categoria").

### 5.5 Link Público de Captação (`/app/clientes/public-link`)
- **Link permanente** fixo por agência (baseado no slug).
- **Links gerenciáveis**: até 5 links nomeados, com UTM/rastreamento de origem (para campanhas, influenciadores, representantes).
- **Links temporários**: expiram em 24h e são excluídos após o uso (1 uso único, indicado para envio individual a um cliente específico).
- Configuração de **campos visíveis no formulário público** (habilitar/desabilitar campos).
- Personalização visual: tema pré-definido (Clássico, Aviação, Nuvens) ou cor de fundo customizada.
- Preview ao vivo do formulário (iframe/nova aba).
- **Fluxo**: cliente acessa o link → preenche dados → registro é criado automaticamente na lista de Clientes da agência.

---

## 6. Módulo: Cotações (Pipeline/Funil de vendas)

### 6.1 Kanban de Cotações (`/app/cotacoes`)
Estágios fixos do funil (colunas do Kanban, drag-and-drop entre colunas):
1. **Nova**
2. **Em Atendimento**
3. **Proposta Enviada**
4. **Aguardando Cliente**
5. **Aprovada**
6. **Perdida**

- Cards mostram: código da cotação (ex. `COT-4688DF`), nome do cliente, telefone, valor total, tag de prioridade (ex. "Normal").
- KPIs no topo: Total de cotações, Aguardando resposta, Valor total.
- Busca por cliente/destino, filtros.

### 6.2 Criação — modal "Nova Cotação"
- Buscar cliente existente OU digitar novo lead (nome, telefone com DDI, email).
- Campo de observações (até 2000 caracteres).
- Seleção de responsável (vendedor) — padrão "manter responsável atual".
- Botão "Continuar para Proposta" → leva à montagem dos itens/serviços da proposta (aéreo, hotel, pacote, seguro, etc. — ver Catálogo).

### 6.3 Catálogo de Serviços (`/app/cotacoes/catalog`)
- Itens de serviço pré-cadastrados e reutilizáveis (nome, tipo, descrição, preço de custo/venda) para agilizar a montagem de cotações — evita digitar tudo do zero a cada proposta.
- Filtro por tipo de serviço.

### 6.4 Link Público de Cotação (`/app/cotacoes/public-link`)
- Mesma arquitetura do link público de clientes (permanente, gerenciável, temporário, tema/cor, preview).
- **Fluxo**: cliente preenche a viagem desejada → cai automaticamente na coluna "Nova" do Kanban de Cotações.

### Regras de negócio
- Ao mover um card entre colunas, deve ser criado um evento no log de atividades ("Cotação movida de X para Y").
- Cotação aprovada deve poder ser convertida em Venda (handoff Cotação → Venda).

---

## 7. Módulo: Emissões

### 7.1 Bilhetes (`/app/bilhetes`)
- Abas: Bilhetes | Check-in | Regras tarifárias.
- Busca por localizador, código de compra ou sobrenome.
- Filtros de data rápidos: Todos, Hoje, Amanhã, Esta Semana, Personalizado.
- Colunas: ID emissão, tipo (ex. Somente Ida), sobrenome, [companhia, PNR, datas, status — inferido do dashboard].
- Ação "Retentar" (reprocessar emissão com erro) e "Excluir".
- **Regras Tarifárias**: seção separada, provavelmente cadastro de regras de reembolso/remarcação por companhia/tarifa.

#### Cadastro — modal "Novo Bilhete" (2 caminhos)
1. **Seleção manual de companhia** (LATAM, GOL, Azul, Air Portugal, Air Europa, American Airlines, Copa Airlines, Air France, Iberia, Avianca, United, ou "Manual"):
   - Após escolher a companhia → formulário: **Código da Reserva/Localizador** (6 caracteres), **Sobrenome do passageiro**, **Aeroporto de origem** (busca por código IATA/nome) → "Adicionar Bilhete".
   - Isso indica que o backend deve **consultar/importar a reserva na companhia aérea** (via scraping, API oficial ou parceiro GDS) a partir do localizador + sobrenome, para trazer automaticamente voo, datas, horários, passageiros.
2. **"Gerar com IA" (NOVO)**: provavelmente o usuário cola o texto bruto do e-cket/localizador (ex. texto copiado do GDS ou do e-mail da companhia) e uma IA extrai os campos estruturados (companhia, PNR, passageiros, trechos, datas). Consome **créditos de IA** do plano.
- **Ícone de ajuda (?)** ao lado do título "Novo Bilhete" sugere um tutorial contextual.

### 7.2 Check-in (`/app/checkin`)
- Filtros: Todos, Pendentes, Agendados, Concluídos, Perdidos + filtro de período.
- Alternância de visualização em 1 ou 2 colunas.
- Botão "Atualizar" (poll manual de status).
- Busca por nome, PNR, companhia, rota.

### Regras de negócio
- Sistema deve monitorar automaticamente a **janela de check-in online** de cada bilhete (ex. abre 48h antes do voo — ver `/app/configuracoes/notifications`, campo "Antecedência do Check-in") e dispará-lo (ou ao menos alertar) quando disponível.
- Deve integrar com companhias aéreas para verificar status de check-in (feito, pendente, perdido).
- Notificações via navegador, Telegram e provavelmente WhatsApp quando o check-in está disponível ("Lembrete de Check-in" nas notificações e template WhatsApp "Lembrete de Voo").

### 7.3 Excursões (`/app/excursoes`) — *recurso pago*
"Grupos de viagem corporativos" — gestão de excursões/grupos:
- Lista filtrável por status.
- KPIs esperados (conforme relatório "Resumo de Excursões"): membros, bilhetes emitidos, receita, margem por excursão.
- Sub-tela "Detalhe de Membros": lista de membros do grupo com bilhete e status individual.
- Provavelmente permite: criar excursão (nome, destino, datas, responsável), adicionar membros/passageiros, vincular bilhetes/vendas a cada membro, acompanhar pagamento individual.

### 7.4 Vouchers (`/app/vouchers`) — **BETA**
"Emissão e gerenciamento de vouchers para seus clientes":
- KPIs: Total de Vouchers, Finalizados, Rascunhos.
- Colunas: Nº, Título, Cliente, Status, Origem, Criado em.
- **Origem**: voucher pode ser criado manualmente OU **gerado automaticamente a partir de uma Venda** (confirmado no log de atividades: "Voucher criado a partir da venda").
- Ações por linha: Visualizar, Excluir; link direto para a ficha do cliente.
- Botão "Personalizar" (provavelmente template/aparência do voucher em PDF).

---

## 8. Módulo: Calendário e Tarefas

### 8.1 Calendário (`/app/calendario`)
- Visões: Mês, Semana, Dia, Lista.
- Navegação por mês, botão "Hoje".
- Tipos de evento (com toggle de filtro): **Evento**, **Tarefa**, **Voo**, **Serviços**.
- Filtro adicional: Todos / Com Cliente / Sem Cliente.
- KPIs no topo: Voando Hoje, Voando Amanhã, Total de Voos, Check-ins Pendentes, Check-ins Realizados, Tarefas Hoje, Tarefas Pendentes, Eventos Ativos.
- Exibe automaticamente **aniversários dos clientes do mês** como eventos ("Aniversários de Setembro").
- Criação de "Novo Evento" manual.
- Voos e tarefas aparecem automaticamente no calendário a partir dos módulos de Bilhetes e Tarefas (dados espelhados, não duplicados).

### 8.2 Tarefas (`/app/tarefas`)
- KPIs: Total de Tarefas, Vencidas.
- Gerenciamento de colunas visíveis na tabela.
- Busca e filtros.
- "Nova Tarefa" (provavelmente: título, descrição, responsável, data de vencimento, prioridade, vínculo opcional a cliente/venda/cotação).

---

## 9. Módulo Financeiro

### 9.1 Painel Financeiro (`/app/painel-financeiro`)
KPIs mensais: Receita, Despesas, Saldo, Margem, Ticket Médio. (Visão gerencial resumida, complementar ao Dashboard operacional.)

### 9.2 Vendas (`/app/vendas`)
- Navegação por mês (mês anterior/próximo) + "Ver tudo".
- KPIs: Vendas (qtd), Receita Lançada, Lucro Lançado, Margem Média, Receita Pendente, Lucro Pendente — todos "no mês".
- Tabela configurável (seletor de colunas, ex. "9/15" colunas visíveis): Nº, Cliente, Referências, Valor, Lucro, Status, Pagamento, Data da Venda, Vendedor.
- Cada linha expansível ("Ver mais informações").

#### Cadastro — modal "Nova Venda" (wizard de 5 passos)
1. **Cliente**: busca cliente existente ou "Cadastro Rápido"; Data da Venda (padrão hoje, editável).
2. **Origem**: provavelmente vincula a venda a uma Cotação existente ou marca como venda direta/avulsa.
3. **Itens**: adiciona os serviços vendidos (aéreo, hotel, pacote, seguro, traslado etc.), com valor de custo e valor de venda por item (para cálculo de lucro/margem).
4. **Pagamento**: forma de pagamento, parcelamento, valores recebidos x pendentes, vencimentos.
5. **Confirmar**: revisão final e criação da venda.

### Regras de negócio
- Ao confirmar uma venda: sistema deve automaticamente:
  - Gerar as **Transações financeiras** (entrada de receita, e possivelmente saída se houver repasse a fornecedor).
  - Calcular e registrar a **Comissão do vendedor** (se módulo de comissões ativo) com base no **lucro da venda** (não no valor bruto).
  - Permitir gerar Voucher, Contrato, Recibo e Nota Fiscal a partir da venda.
  - Disparar mensagem de WhatsApp de confirmação de venda (template "Confirmação de Venda").
  - Registrar evento no log de atividades.

### 9.3 Transações (`/app/transacoes`)
- Navegação por mês + "Ver tudo".
- KPIs: Entradas Recebidas do Mês, Saídas Realizadas do Mês, Saldo Realizado do Mês, A Receber do Mês.
- Tabela: Tipo (entrada/saída), Descrição, Cliente, Data, Status, Valor, Operador.
- "Nova Transação" manual (lançamento avulso, fora do fluxo de venda).
- Seletor de colunas.

### 9.4 Metas (`/app/metas`) — "Portal de Metas"
- Seleção de mês/ano e "Responsável" (vendedor ou "todos").
- Painel carrega metas por responsável (indica metas individuais de vendas por vendedor/mês, comparando realizado x meta).

### 9.5 Contas a Pagar (`/app/contas`)
- Navegação por mês + "Ver tudo".
- KPIs: Total Pendente, Vencendo em 7 dias, Total Pago, Contas Pagas (qtd), Canceladas.
- Tabela configurável: Conta, Categoria, Valor, Vencimento, Status, Recorrência (indicado por "REC.").
- Suporta **contas recorrentes** (ex. aluguel, assinaturas mensais).
- "Nova Conta" manual, com categoria de despesa.

### 9.6 Contas Financeiras / Bancárias (`/app/bancos`)
- KPIs: Saldo Total, Contas Ativas, Última Atualização.
- Cadastro de contas bancárias/financeiras da agência (para saber de onde saiu/entrou cada valor — ver relatório "Saldo por Conta").
- Busca por nome ou instituição.

### 9.7 Comissões (`/app/comissoes`)
- KPIs: Pendente de Repasse, Repassado no Mês, Média por Venda.
- Tabela: Vendedor, Lucro (da venda), Taxa (%), Comissão (valor calculado), Status (pendente/repassado), Data.
- **Texto do sistema confirma a regra de negócio**: *"Comissões são geradas automaticamente ao lançar vendas."*
- Configuração global em `/app/configuracoes/comissoes`: sistema pode estar **Ativado/Desativado**; taxa global padrão (%) sobre o **lucro** da venda; taxas individuais por vendedor podem sobrepor a taxa global (definidas na tela de Equipe).

### 9.8 Afiliados (`/app/afiliados`) — *recurso pago, não detalhado (bloqueado no plano teste)*
Provável programa de indicação/comissionamento para parceiros externos.

### 9.9 Contratos (`/app/contratos`)
- KPIs: Total de Contratos, Pendentes de Assinatura, Assinados.
- Tabela: Nº, Cliente, Template usado, Status, Data.
- **Modelos** (`/app/contratos/templates`): catálogo de templates de contrato (ex. "Contrato de Prestação de Serviços de Viagem" com 7 cláusulas e 18 campos variáveis/merge fields).
- Fluxo: contrato gerado a partir de um template + dados da venda/cliente → **assinatura digital eletrônica** (o cliente assina via link enviado por WhatsApp — ver template "Envio de Link de Assinatura" e a seção de Assinatura Digital da agência em Configurações, que é desenhada à mão e aplicada nos contratos assinados pela agência).
- Suporte para solicitar **novos modelos de contrato ao suporte** (indica que templates são geridos centralmente pela plataforma, não editáveis livremente pelo usuário nesse estágio).

### 9.10 Recibos (`/app/recibos`)
- KPIs: Total de Recibos, Emitidos este Mês, Valor Acumulado.
- Tabela: Nº, Cliente, Valor, Forma de Pagamento, Data de Emissão.
- **Modelos** (`/app/recibos/modelos`): 6 templates visuais prontos (Clássico/Formal, Moderno/Brand, Minimalista/Clean, Executivo/Corporativo, Compacto/Eficiente, Premium/Luxo — este último com badge "Destaque"). Alguns "usam as cores da marca da agência".
- Estrutura de dados de um recibo: número (ex. `RCB-2025/001`), nome/CPF do pagador, descrição da referência (ex. "Pacote de viagem — origem → destino"), tabela de itens (descrição, quantidade, valor unitário, total), valor total (numérico + por extenso), forma de pagamento (inclusive parcelamento, ex. "6x de R$X"), observações, data e local de emissão, dados do emitente (nome da agência + CNPJ), rodapé padrão "Este documento não constitui nota fiscal".
- Permite definir um **modelo padrão** para pular a etapa de seleção ao criar novo recibo.

### 9.11 Fiscal / Painel Fiscal — NFS-e Nacional (`/app/fiscal`)
"Gerencie a emissão de notas fiscais de serviço eletrônicas das suas vendas e suas configurações de emissão tributária."
- KPIs: Faturado no Mês, ISS a Recolher (imposto apurado no ano), Notas Emitidas (no mês), Pendências (falhas de envio).
- Abas: Notas Fiscais | Relatórios | **Emitir NFSe** | **Configuração Fiscal**.
- Tabela: Nº, Cliente, Venda (vínculo), Serviço, Status, Data.
- **Integração obrigatória com o padrão NFS-e Nacional** (ambiente nacional unificado de nota fiscal de serviço eletrônica do governo brasileiro) — isso implica, no backend:
  - Cadastro de configuração fiscal (regime tributário, código de serviço/CNAE, alíquota de ISS, certificado digital A1, dados do município).
  - Emissão de nota via API do provedor de NFS-e Nacional (ou de um parceiro/gateway fiscal), com tratamento de status assíncrono (autorizada, rejeitada, cancelada).
  - Vínculo 1:N nota fiscal → venda.

### 9.12 Relatórios (`/app/relatorios`)
Central de relatórios configuráveis por categoria, com geração sob demanda ("Gerar Relatório") após seleção de tipo + filtros, e exportação (referida como PDF no card "Relatório Completo — Fechamento mensal em PDF").

**Categorias e relatórios disponíveis (lista completa, use como especificação de features do módulo):**
- **Vendas**: por Período; por Tipo de Serviço; por Companhia Aérea; por Cliente; por Vendedor; Top Itens Vendidos; Margem de Lucro; Transações em Atraso; Vendas Canceladas.
- **Financeiro**: Fluxo de Caixa; Receita × Despesa; Pagamentos dos Clientes; Formas de Pagamento; DRE Simplificado; Comissões por Vendedor; Resumo de Comissões; Saldo por Conta.
- **Contas a Pagar**: por Período; por Categoria; Contas em Atraso.
- **Fornecedores**: Vendas por Fornecedor; Ranking de Fornecedores.
- **Clientes**: Ranking de Clientes (Top N por faturamento); Novos Clientes (no período); por Categoria; Histórico do Cliente.
- **Cotações**: Pipeline de Cotações (funil); Taxa de Conversão (por responsável); Motivos de Perda; Tempo Médio no Pipeline.
- **Excursões**: Resumo (KPIs por excursão); Detalhe de Membros.

Cada relatório deve suportar, no mínimo: seleção de período, filtros específicos do tipo (ex. cliente, vendedor, fornecedor, categoria), geração de tabela/gráfico de resultado e exportação (PDF/CSV/Excel).

---

## 10. Módulo: Cadastro (auxiliares)

### 10.1 Fornecedores (`/app/configuracoes/fornecedores`)
- KPIs: Total Ativos, Por Tipo (Top 3), Inativos.
- Filtro: Todos os tipos / Apenas ativos.
- Tabela: Nome, Tipo, Contato, Telefone, Status.
- Usado nas vendas/contas a pagar para vincular custo a fornecedor (operadoras, cias aéreas, hotéis, etc.) — ver relatórios "Vendas por Fornecedor" e "Ranking Fornecedores".

### 10.2 Importações (`/app/importacoes`) — *recurso pago*
Importação em massa de dados (provavelmente clientes, vendas ou bilhetes via planilha/CSV). Bloqueado nos planos testados.

---

## 11. Módulo: Configurações (Agência)

Abas: Agência | Meu Perfil | Equipe | Fornecedores | Email | Notificações | Comissões | WhatsApp | Segurança.

### 11.1 Agência (`/app/configuracoes`)
- **Dados da Agência**: Logo (upload PNG/JPG/WebP), Nome da Agência, CNPJ/CPF, Razão Social (usada em contratos), Tipo de Pessoa (PJ / PF Autônomo / MEI — define qualificação legal nos contratos), Moeda Padrão (ex. Real Brasileiro).
- **Contato e Endereço**: CEP com autocomplete, Telefone, Logradouro, Número, Complemento, Bairro, Cidade, UF.
- **Presença Digital**: E-mail, Website, WhatsApp (com DDI), Instagram, Facebook.
- **Cores da Marca**: Cor primária e secundária (usadas no template de proposta, página pública, recibos, etc.).
- **Assinatura Digital**: campo de desenho (canvas, mouse/touch) da assinatura do responsável da agência, aplicada automaticamente nos contratos assinados.
- **Personalização de Documentos**: toggle para exibir identidade da agência (logo, WhatsApp, email) no topo do PDF do bilhete.
- Metadados exibidos: Slug da agência, Status (Ativo), ID único da agência.

### 11.2 Meu Perfil (`/app/configuracoes/profile`)
Dados pessoais do usuário logado: Nome completo, E-mail (não editável, com selo "confirmado"), Telefone/WhatsApp, vínculo com Telegram pessoal (idem seção 2).

### 11.3 Equipe (`/app/configuracoes/users`)
- Lista de usuários da agência com: nome, email, função, comissão, status, data de entrada.
- Botão "Permissões" (matriz de permissões por função/role — RBAC).
- Botão "Convidar Usuário" (envio de convite por e-mail).

### 11.4 Email (`/app/configuracoes/email`)
- Opção "Usando E-mail Padrão do FixPass" OU configurar **SMTP próprio**: Host, Porta, SSL/TLS, Usuário, Senha, Email remetente, Nome remetente.

### 11.5 Notificações (`/app/configuracoes/notifications`)
- Notificações no navegador (push nativo, requer permissão): Sistema (atualizações), Voos (lembrete de check-in).
- **Antecedência do Check-in**: configurável (padrão 48h antes).
- Vínculo com Telegram para alertas unificados.

### 11.6 Comissões (`/app/configuracoes/comissoes`)
Ver seção 9.7.

### 11.7 WhatsApp Templates (`/app/configuracoes/whatsapp-templates`)
Templates de mensagem editáveis, cada um com: nome, slug/código interno, status (Ativo/Inativo), corpo da mensagem com **variáveis (placeholders)** no formato `{{variavel}}`, ação Editar/Desativar, botão "Novo Template".

**Templates padrão identificados (specs a implementar):**
| Template | Slug | Variáveis usadas |
|---|---|---|
| Confirmação de Venda | `confirmacao_venda` | `{{cliente_primeiro_nome}}`, `{{numero_venda}}`, `{{valor_total}}` |
| Envio de Bilhete | `envio_bilhete` | `{{cliente_primeiro_nome}}`, `{{cia_aerea}}`, `{{pnr}}`, `{{data_voo}}`, `{{horario_voo}}`, `{{origem}}`, `{{destino}}` (inferido) |
| Envio de Link de Assinatura | `envio_contrato` | `{{cliente_primeiro_nome}}`, `{{link_contrato}}` |
| Envio de Proposta | `envio_proposta` | `{{cliente_primeiro_nome}}`, `{{link_proposta}}` |
| Lembrete de Voo | `lembrete_voo` | `{{cliente_primeiro_nome}}`, `{{data_voo}}`, `{{horario_voo}}`, `{{origem}}`, `{{destino}}`, localizador |

O backend deve ter um **motor de template** que faz a substituição de variáveis e dispara a mensagem via integração com a API do WhatsApp (WhatsApp Business API/Cloud API ou provedor tipo Twilio/Z-API).

### 11.8 Segurança (`/app/configuracoes/security`)
- Alterar senha (senha atual + nova + confirmar), com política de senha forte.
- Atividade recente (últimos 5 logins): tipo de evento, navegador/sistema (quando identificável), data/hora, IP.
- Dicas de segurança estáticas (conteúdo informativo).

---

## 12. Módulo: Assinatura e Planos (`/app/assinatura`)

- Exibe estado atual da assinatura (ex. "Teste grátis", dias restantes, data de expiração), botão "Ver Planos"/"Alterar plano".
- **Uso Atual** (medidores de consumo do plano): Créditos de IA (x/10), Bilhetes Emitidos (x/∞ ou limite), Clientes Ativos (x/∞ ou limite), Armazenamento (MB usados / limite em GB).
- **Créditos de IA**: saldo disponível = incluídos no plano + créditos extras comprados; opção "Comprar créditos extras" (pode estar indisponível conforme configuração).
- **Planos (mensal/anual)** — tabela de referência para implementação do controle de acesso por feature-flag:

| Plano | Preço/mês | Usuários | Créditos IA | Principais recursos exclusivos |
|---|---|---|---|---|
| Basic | R$ 47 | — | 50 | Emissão de bilhetes, check-in, excursões, calendário/tarefas, dashboard simplificado (SEM CRM completo, SEM vendas/financeiro) |
| Autônomo | R$ 89 | 1 | 100 | + CRM, Voucher, Cotações Inteligentes, Vendas, Despesas/Receitas, Contratos, Recibos, Fornecedores, Painel de Conciliação, Relatórios Avançados, Metas |
| Profissional (recomendado) | R$ 135 | até 3 | 200 | Tudo do Autônomo, multiusuário |
| Agência | R$ 297 | até 6 | 500 | Tudo do Profissional + **Emissão de Nota Fiscal**, suporte prioritário |

- Essa tabela deve ser usada para implementar **controle de acesso por feature/limite** (feature flags por plano + contadores de uso), incluindo as telas que já aparecem bloqueadas no teste grátis: **Importações** e **Afiliados** (tela de "recurso não incluso" com botão "Comparar planos").

---

## 13. Módulo: Central de Atividades / Registros (`/app/registros`)

"Histórico unificado de todas as operações da agência" — **log de auditoria (audit log)** obrigatório.

- Filtro por categoria: Todos, Cotações, Bilhetes, Vendas, Clientes, Financeiro, Contratos, Comercial, Segurança, Configurações.
- Cada evento contém: autor (usuário, com iniciais/avatar), descrição da ação em linguagem natural, tipo/entidade relacionada, código de referência da entidade (quando aplicável, ex. `#VND-8F9137`, `#COT-4688DF`, `#CE2AAA`), tempo relativo ("11min atrás") e data.
- Eventos observados como exemplo de granularidade esperada: criação de agência, cadastro de usuário, login realizado, criação de cliente, criação de cotação, mudança de estágio da cotação (com "de X para Y"), criação de bilhete, criação de venda, criação de voucher a partir de venda.

### Regra de negócio central
**Toda ação relevante do sistema (create/update/status-change em qualquer entidade de negócio) deve gravar um registro de auditoria** com: `agency_id`, `user_id`, `entity_type`, `entity_id`, `action_description`, `metadata` (JSON com dados relevantes, como cliente/valor), `created_at`.

---

## 14. Convenções de Códigos/IDs observadas

Usar como padrão de geração de identificadores legíveis (human-readable IDs), além do UUID interno:
- Cotação: `COT-XXXXXX` (hex)
- Venda: `VND-XXXXXX` (hex)
- Bilhete: `#XXXXXX` (hex, ex. `CE2AAA`)
- Recibo: `RCB-AAAA/NNN` (ano/sequencial)
- Nota Fiscal: sequencial próprio (por regras da prefeitura/NFS-e Nacional)

---

## 15. Requisitos Não Funcionais e de Arquitetura (para o backend)

1. **Multi-tenancy** obrigatório em todas as tabelas de negócio (via `agency_id`), com isolamento rígido a nível de query/RLS.
2. **RBAC** (controle de acesso baseado em papel) configurável por agência (tela de Permissões).
3. **Feature flags por plano de assinatura** + contadores de uso (créditos de IA, armazenamento, nº de usuários, bilhetes emitidos) com bloqueio suave (tela "recurso não incluído" + CTA de upgrade) em vez de erro técnico.
4. **Auditoria (event log)** central, populada por toda ação de escrita relevante (seção 13).
5. **Motor de templates com variáveis** para WhatsApp, contratos (18 campos), recibos e propostas.
6. **Geração de PDF** para: bilhetes, contratos assinados, recibos (6 layouts), propostas, relatório completo mensal, notas fiscais.
7. **Páginas públicas sem autenticação**, isoladas por slug de agência, com submissão que cria registros no tenant correto e captura de UTM (para links gerenciáveis) e expiração automática (para links temporários — job/cron de limpeza).
8. **Integrações externas**:
   - WhatsApp Business (envio de mensagens template).
   - Telegram Bot API (alertas pessoais via deep-link ou código temporário de vínculo).
   - SMTP customizável por agência + SMTP padrão de fallback.
   - Serviço de consulta de CEP (tipo ViaCEP).
   - Serviço de consulta de CPF/dados cadastrais (para autofill de "Preencher dados").
   - Emissor de NFS-e Nacional (API do padrão nacional ou gateway fiscal terceirizado).
   - Companhias aéreas: consulta de PNR por localizador+sobrenome (via scraping autorizado, GDS ou parceria) para múltiplas companhias (LATAM, GOL, Azul, Air Portugal, Air Europa, American, Copa, Air France, Iberia, Avianca, United) + fluxo manual como fallback.
   - Serviço de IA (LLM) para extração estruturada de dados de bilhete a partir de texto colado ("Gerar com IA"), consumindo créditos do plano.
   - Serviço de aeroportos (busca por código IATA/nome) para autocomplete de origem/destino.
9. **Assinatura digital de contrato**: geração de link único, temporário, para o cliente assinar (captura de assinatura + carimbo de data/hora + possivelmente IP, para valor probatório), e template de mensagem de envio via WhatsApp.
10. **Jobs assíncronos/cron**: monitoramento de janela de check-in por voo, expiração de links temporários, cálculo de comissões, geração de notificações agendadas (lembrete de check-in, aniversários, contas a vencer).
11. **Cálculo financeiro em duas dimensões**: valor lançado/contratado (accrual) vs. valor recebido/pago (caixa) — presente em Vendas, Contas a Pagar, Dashboard.
12. **Internacionalização de moeda**: sistema modelado com "moeda padrão" configurável, mesmo operando hoje apenas em BRL.

---

## 16. Entidades de Dados Sugeridas (modelo mínimo para o backend)

> Lista não exaustiva, mas suficiente para começar a modelagem relacional. Todas as tabelas de negócio possuem `agency_id`, `created_at`, `updated_at`, `created_by`.

- `agencies` (dados da seção 11.1, slug, logo, cores, moeda, plano atual)
- `users` (conta de login) / `agency_members` (vínculo user↔agency com role, comissão %, status)
- `roles` / `permissions` (RBAC)
- `clients` (PF/PJ, endereço, passaporte, categorias N:N, dependentes 1:N auto-relacionamento)
- `client_categories`
- `public_links` (tipo cliente/cotação; permanente/gerenciável/temporário; UTM; tema/cor; expiração)
- `quotes` (cotações) + `quote_stage_history` (histórico de mudança de estágio)
- `quote_catalog_items` (catálogo de serviços)
- `sales` (vendas) + `sale_items` (itens com custo/venda) + `sale_origin` (de cotação ou avulsa)
- `tickets` (bilhetes) com companhia, PNR, sobrenome, aeroporto origem/destino, status, dados brutos de retorno da consulta
- `checkins` (status por bilhete/passageiro)
- `tours` (excursões) + `tour_members`
- `vouchers`
- `transactions` (financeiro genérico: entrada/saída, vínculo opcional a venda)
- `payables` (contas a pagar) com recorrência
- `bank_accounts`
- `commissions` (por venda/vendedor)
- `goals` (metas por responsável/mês)
- `contracts` + `contract_templates`
- `receipts` + `receipt_templates`
- `fiscal_invoices` (NFS-e) + `fiscal_config`
- `whatsapp_templates`
- `notifications` / `notification_preferences`
- `activity_log` (auditoria, seção 13)
- `suppliers` (fornecedores)
- `subscriptions` + `plans` + `usage_counters` (créditos IA, armazenamento, etc.)
- `tasks`
- `calendar_events`

---

## 17. Escopo sugerido para o MVP do TCC

Dado o tamanho do sistema completo, recomenda-se ao aluno **priorizar um subconjunto coerente e demonstrável** para o TCC, por exemplo:
1. Autenticação + multi-tenant básico + 1 papel (owner).
2. Clientes (CRUD completo, sem autofill de CPF/CEP se não houver tempo — pode ser mockado).
3. Cotações (Kanban com os 6 estágios).
4. Vendas (wizard simplificado: cliente → itens → pagamento → confirmar).
5. Transações e Contas a Pagar (financeiro básico).
6. Dashboard com os principais KPIs.
7. Log de atividades (fácil de implementar e de grande efeito para a banca).
8. 1–2 relatórios (ex. Vendas por Período, Ranking de Clientes).

Módulos como NFS-e, integração real com companhias aéreas, WhatsApp Business API e IA generativa podem ser **simulados (mock)** no TCC, documentando no relatório que, em produção, seriam integrações externas reais — isso é aceitável academicamente e reduz drasticamente o risco do projeto.

---

*Documento gerado a partir de varredura funcional completa da aplicação (todas as rotas do menu principal, sub-rotas de configurações, modais de criação de Cliente/Cotação/Bilhete/Venda, e páginas de planos). Deve ser usado em conjunto com os arquivos HTML/CSS (Single File) já capturados de cada tela.*
