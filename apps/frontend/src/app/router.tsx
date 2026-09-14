import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RequireAuth } from '@/components/shared/RequireAuth'

import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { AjudaPage } from '@/modules/auth/pages/AjudaPage'
import { ClientePublicoPage } from '@/modules/publico/pages/ClientePublicoPage'
import { CotacaoPublicoPage } from '@/modules/publico/pages/CotacaoPublicoPage'

import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'

import { ClientesPage } from '@/modules/clientes/pages/ClientesPage'
import { ClientesCategoriasPage } from '@/modules/clientes/pages/ClientesCategoriasPage'
import { ClientesLayout } from '@/modules/clientes/pages/ClientesLayout'
import { ClientesPublicLinkPage } from '@/modules/clientes/pages/ClientesPublicLinkPage'
import { ClienteFichaPage } from '@/modules/clientes/pages/ClienteFichaPage'

import { CotacoesPage } from '@/modules/cotacoes/pages/CotacoesPage'
import { CotacoesCatalogPage } from '@/modules/cotacoes/pages/CotacoesCatalogPage'
import { CotacoesPublicLinkPage } from '@/modules/cotacoes/pages/CotacoesPublicLinkPage'

import { BilhetesPage } from '@/modules/bilhetes/pages/BilhetesPage'
import { CheckinPage } from '@/modules/checkin/pages/CheckinPage'
import { ExcursoesPage } from '@/modules/excursoes/pages/ExcursoesPage'
import { VouchersPage } from '@/modules/vouchers/pages/VouchersPage'
import { CalendarioPage } from '@/modules/calendario/pages/CalendarioPage'
import { TarefasPage } from '@/modules/tarefas/pages/TarefasPage'

import { PainelFinanceiroPage } from '@/modules/financeiro/painel/pages/PainelFinanceiroPage'
import { VendasPage } from '@/modules/financeiro/vendas/pages/VendasPage'
import { VendaDetalhePage } from '@/modules/financeiro/vendas/pages/VendaDetalhePage'
import { TransacoesPage } from '@/modules/financeiro/transacoes/pages/TransacoesPage'
import { MetasPage } from '@/modules/financeiro/metas/pages/MetasPage'
import { ContasAPagarPage } from '@/modules/financeiro/contas-a-pagar/pages/ContasAPagarPage'
import { ContasBancariasPage } from '@/modules/financeiro/contas-bancarias/pages/ContasBancariasPage'
import { ComissoesPage } from '@/modules/financeiro/comissoes/pages/ComissoesPage'
import { AfiliadosPage } from '@/modules/financeiro/afiliados/pages/AfiliadosPage'
import { ContratosPage } from '@/modules/financeiro/contratos/pages/ContratosPage'
import { ContratosTemplatesPage } from '@/modules/financeiro/contratos/pages/ContratosTemplatesPage'
import { RecibosPage } from '@/modules/financeiro/recibos/pages/RecibosPage'
import { RecibosModelosPage } from '@/modules/financeiro/recibos/pages/RecibosModelosPage'
import { FiscalPage } from '@/modules/financeiro/fiscal/pages/FiscalPage'
import { FaturasPage } from '@/modules/financeiro/faturas/pages/FaturasPage'
import { RelatoriosPage } from '@/modules/financeiro/relatorios/pages/RelatoriosPage'

import { ImportacoesPage } from '@/modules/importacoes/pages/ImportacoesPage'
import { AssinaturaPage } from '@/modules/assinatura/pages/AssinaturaPage'
import { RegistrosPage } from '@/modules/registros/pages/RegistrosPage'

import { ConfiguracoesLayout } from '@/modules/configuracoes/pages/ConfiguracoesLayout'
import { AgenciaTabPage } from '@/modules/configuracoes/pages/AgenciaTabPage'
import { PerfilTabPage } from '@/modules/configuracoes/pages/PerfilTabPage'
import { EquipeTabPage } from '@/modules/configuracoes/pages/EquipeTabPage'
import { FornecedoresTabPage } from '@/modules/configuracoes/pages/fornecedores/FornecedoresTabPage'
import { EmailTabPage } from '@/modules/configuracoes/pages/EmailTabPage'
import { NotificacoesTabPage } from '@/modules/configuracoes/pages/NotificacoesTabPage'
import { ComissoesTabPage } from '@/modules/configuracoes/pages/ComissoesTabPage'
import { WhatsappTemplatesTabPage } from '@/modules/configuracoes/pages/WhatsappTemplatesTabPage'
import { SegurancaTabPage } from '@/modules/configuracoes/pages/SegurancaTabPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },

  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/cotacao/:slug', element: <CotacaoPublicoPage /> },
    ],
  },

  // Fora do AuthLayout de propósito: controla o próprio visual (tema por
  // agência), não o cabeçalho fixo de login/páginas públicas genéricas.
  { path: '/cliente/:slug', element: <ClientePublicoPage /> },

  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/ajuda', element: <AjudaPage /> },
      {
        path: '/app',
        children: [
          { index: true, element: <DashboardPage /> },

          {
            path: 'clientes',
            element: <ClientesLayout />,
            children: [
              { index: true, element: <ClientesPage /> },
              { path: 'categories', element: <ClientesCategoriasPage /> },
              { path: 'public-link', element: <ClientesPublicLinkPage /> },
            ],
          },
          { path: 'clientes/:id/ficha', element: <ClienteFichaPage /> },

          { path: 'cotacoes', element: <CotacoesPage /> },
          { path: 'cotacoes/catalog', element: <CotacoesCatalogPage /> },
          { path: 'cotacoes/public-link', element: <CotacoesPublicLinkPage /> },

          { path: 'bilhetes', element: <BilhetesPage /> },
          { path: 'checkin', element: <CheckinPage /> },
          { path: 'excursoes', element: <ExcursoesPage /> },
          { path: 'vouchers', element: <VouchersPage /> },
          { path: 'calendario', element: <CalendarioPage /> },
          { path: 'tarefas', element: <TarefasPage /> },

          { path: 'painel-financeiro', element: <PainelFinanceiroPage /> },
          { path: 'vendas', element: <VendasPage /> },
          { path: 'vendas/:id', element: <VendaDetalhePage /> },
          { path: 'transacoes', element: <TransacoesPage /> },
          { path: 'metas', element: <MetasPage /> },
          { path: 'contas', element: <ContasAPagarPage /> },
          { path: 'bancos', element: <ContasBancariasPage /> },
          { path: 'comissoes', element: <ComissoesPage /> },
          { path: 'afiliados', element: <AfiliadosPage /> },
          { path: 'contratos', element: <ContratosPage /> },
          { path: 'contratos/templates', element: <ContratosTemplatesPage /> },
          { path: 'recibos', element: <RecibosPage /> },
          { path: 'recibos/modelos', element: <RecibosModelosPage /> },
          { path: 'faturas', element: <FaturasPage /> },
          { path: 'fiscal', element: <FiscalPage /> },
          { path: 'relatorios', element: <RelatoriosPage /> },

          { path: 'importacoes', element: <ImportacoesPage /> },
          { path: 'assinatura', element: <AssinaturaPage /> },
          { path: 'registros', element: <RegistrosPage /> },

          {
            path: 'configuracoes',
            element: <ConfiguracoesLayout />,
            children: [
              { index: true, element: <AgenciaTabPage /> },
              { path: 'profile', element: <PerfilTabPage /> },
              { path: 'users', element: <EquipeTabPage /> },
              { path: 'fornecedores', element: <FornecedoresTabPage /> },
              { path: 'email', element: <EmailTabPage /> },
              { path: 'notifications', element: <NotificacoesTabPage /> },
              { path: 'comissoes', element: <ComissoesTabPage /> },
              { path: 'whatsapp-templates', element: <WhatsappTemplatesTabPage /> },
              { path: 'security', element: <SegurancaTabPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/app" replace /> },
])
