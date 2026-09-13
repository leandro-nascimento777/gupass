import { useState } from 'react'
import {
  Banknote,
  Eye,
  EyeOff,
  LayoutGrid,
  PiggyBank,
  Receipt,
  Repeat,
  Settings2,
  Ticket as TicketIcon,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Wallet2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { KpiCard } from '@/components/shared/KpiCard'
import { PeriodFilter } from '@/components/shared/PeriodFilter'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { useUiStore } from '@/lib/stores/ui-store'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ticketStatusMap } from '@/lib/status-maps'
import { formatCurrency, formatDate } from '@/lib/format'
import { useDashboardKpis, type DashboardPeriod } from '../hooks/useDashboardKpis'

export function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('mes')
  const { data, isLoading, isError, refetch } = useDashboardKpis(period)
  const hideFinancialValues = useUiStore((s) => s.hideFinancialValues)
  const toggleHideFinancialValues = useUiStore((s) => s.toggleHideFinancialValues)
  const { user } = useAuth()

  const [emailBannerDismissed, setEmailBannerDismissed] = useState(false)
  const [agencyBannerDismissed, setAgencyBannerDismissed] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {!emailBannerDismissed && (
        <AlertBanner
          title="Seu e-mail ainda não foi verificado"
          description={`Para evitar restrições de acesso, precisamos que confirme o e-mail (${user?.email}).`}
          actionLabel="Reenviar e-mail"
          onDismiss={() => setEmailBannerDismissed(true)}
        />
      )}
      {!agencyBannerDismissed && (
        <AlertBanner
          title="Complete as informações da sua agência"
          description="Preencha os dados essenciais da sua agência (CNPJ/CPF, cidade, estado, endereço, telefone) para habilitar a emissão de notas fiscais e a geração automática de documentos."
          actionLabel="Completar Cadastro"
          onDismiss={() => setAgencyBannerDismissed(true)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Painel Operacional</h1>
          <p className="text-sm text-muted-foreground">Visão geral do seu negócio.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PeriodFilter value={period} onChange={(v) => setPeriod(v as DashboardPeriod)} showCustomRange />
          <Button variant="outline" size="sm" className="rounded-full">
            <LayoutGrid className="size-4" />
            Organizar
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={toggleHideFinancialValues}
            aria-label={hideFinancialValues ? 'Mostrar valores financeiros' : 'Ocultar valores financeiros'}
          >
            {hideFinancialValues ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Settings2 className="size-4" />
            Personalizar
          </Button>
        </div>
      </div>

      {isError && (
        <Card className="border-destructive/40">
          <CardContent className="flex items-center justify-between py-4 text-sm">
            <span className="text-destructive">Não foi possível carregar os dados do painel.</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl shadow-none">
            <CardContent className="flex flex-col gap-3 py-1">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-dark">
                  <TicketIcon className="size-4" />
                </div>
                <span className="text-sm font-medium">Últimas Emissões</span>
              </div>
              {data.latestTickets.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <TicketIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Nenhum bilhete emitido.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.latestTickets.map((ticket) => {
                    const status = ticketStatusMap[ticket.status] ?? { label: ticket.status, tone: 'neutral' as const }
                    return (
                      <div key={ticket.id} className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{ticket.airline}</span>
                          <span className="text-xs text-muted-foreground">
                            {ticket.label} · {formatDate(ticket.date)}
                          </span>
                        </div>
                        <StatusBadge label={status.label} tone={status.tone} />
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <KpiCard
            label="Status das Cotações"
            value={data.quotesTotal}
            hint={`${data.quotesNew} novas no período`}
            icon={Users}
            periodTag="Este Mês"
          />
          <KpiCard label="Check-ins Pendentes" value={data.checkinsPending} hint="check-ins pendentes" icon={TicketIcon} />
          <KpiCard
            label="Taxa de Conversão"
            value={`${data.conversionRate}%`}
            hint={`${data.conversionFraction[0]} de ${data.conversionFraction[1]} cotações convertidas`}
            icon={TrendingUp}
            tone="success"
            periodTag="Este Mês"
          />
          <KpiCard label="Vendas do Período" value={data.salesCount} hint={`${formatCurrency(data.salesTotal)} em vendas`} icon={Receipt} />
          <KpiCard label="Ticket Médio" value={data.averageTicket} isCurrency hint="ticket médio por venda" icon={Wallet} />
          <KpiCard label="Faturamento" value={data.revenueBilled} isCurrency hint="faturamento no período" icon={Banknote} periodTag="Este Mês" />
          <KpiCard label="Receita Recebida" value={data.revenueReceived} isCurrency hint="receita recebida no período" icon={PiggyBank} tone="success" />
          <KpiCard label="Contas a Pagar" value={data.payablesTotal} isCurrency hint="a pagar pendente" icon={Wallet2} tone="warning" />
          <KpiCard label="Despesa Paga" value={data.expensesPaid} isCurrency hint="despesa paga no período" icon={TrendingDown} periodTag="Este Mês" />

          <Card className="rounded-2xl shadow-none">
            <CardContent className="flex flex-col gap-3 py-1">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-dark">
                  <Wallet className="size-4" />
                </div>
                <span className="text-sm font-medium">Fluxo de Caixa</span>
                <span className="ml-auto text-xs text-muted-foreground">Este Mês</span>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-muted-foreground">Entradas</p>
                  <p className="text-lg font-black text-success">{formatCurrency(data.revenueReceived)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Saídas</p>
                  <p className="text-lg font-black text-destructive">{formatCurrency(data.expensesPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <KpiCard
            label="Transações em Atraso"
            value={data.overdueTransactionsCount}
            hint={`${formatCurrency(data.overdueTransactionsTotal)} em atraso`}
            icon={Repeat}
            tone="danger"
            periodTag="Este Mês"
          />
          <KpiCard label="Lucro Bruto" value={data.grossProfit} isCurrency hint="lucro bruto de vendas" icon={TrendingUp} tone="success" periodTag="Este Mês" />
        </div>
      )}
    </div>
  )
}
