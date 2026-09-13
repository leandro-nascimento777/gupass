import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, FileText, Mail, MapPin, Phone, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  contractStatusMap,
  quoteStageMap,
  saleStatusMap,
  ticketStatusMap,
  voucherStatusMap,
} from '@/lib/status-maps'
import { useClientCategories } from '../hooks/useClientCategories'
import { useClient, useClientHistory } from '../hooks/useClientFicha'
import { useDeleteClient } from '../hooks/useClients'

/** Linha simples de lista (sem tabela) — cada aba de histórico usa o mesmo formato. */
function HistoryRow({
  title,
  meta,
  value,
  status,
  to,
}: {
  title: string
  meta: string
  value?: string
  status: { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }
  to?: string
}) {
  const content = (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {value && <span className="text-sm font-semibold tabular-nums">{value}</span>}
        <StatusBadge label={status.label} tone={status.tone} />
      </div>
    </div>
  )
  return to ? (
    <Link to={to} className="block rounded-lg px-2 -mx-2 hover:bg-muted/50">
      {content}
    </Link>
  ) : (
    <div className="px-2 -mx-2">{content}</div>
  )
}

function EmptyHistory({ label }: { label: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{label}</p>
}

export function ClienteFichaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: client, isLoading, isError } = useClient(id ?? '')
  const { data: history, isLoading: historyLoading } = useClientHistory(id ?? '')
  const { data: categoriesData } = useClientCategories()
  const deleteClient = useDeleteClient()

  const categoryById = new Map((categoriesData?.data ?? []).map((c) => [c.id, c]))

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (isError || !client) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-medium">Cliente não encontrado.</p>
        <Button variant="outline" asChild>
          <Link to="/app/clientes">
            <ArrowLeft className="size-4" /> Voltar para Clientes
          </Link>
        </Button>
      </div>
    )
  }

  const categories = client.categoryIds.map((cid) => categoryById.get(cid)).filter(Boolean)

  async function handleDelete() {
    if (!client) return
    await deleteClient.mutateAsync(client.id)
    navigate('/app/clientes')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/clientes">
            <ArrowLeft className="size-4" /> Clientes
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          disabled={deleteClient.isPending}
        >
          <Trash2 className="size-4" /> Excluir cliente
        </Button>
      </div>

      <Card className="rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-4 py-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-dark">
                {client.personType === 'PF' ? <User className="size-6" /> : <Building2 className="size-6" />}
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">{client.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {client.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} · Cliente desde{' '}
                  {formatDate(client.createdAt)}
                </p>
              </div>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <Badge key={cat!.id} variant="outline" style={{ borderColor: cat!.color, color: cat!.color }}>
                    {cat!.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <span>{client.email ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" />
              <span>{client.phone ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{client.city ? `${client.city}/${client.state ?? ''}` : '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="size-4 text-muted-foreground" />
              <span>{client.document ?? '—'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas ({history?.sales.length ?? 0})</TabsTrigger>
          <TabsTrigger value="cotacoes">Cotações ({history?.quotes.length ?? 0})</TabsTrigger>
          <TabsTrigger value="contratos">Contratos ({history?.contracts.length ?? 0})</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers ({history?.vouchers.length ?? 0})</TabsTrigger>
          <TabsTrigger value="bilhetes">Bilhetes ({history?.tickets.length ?? 0})</TabsTrigger>
        </TabsList>

        <Card className="mt-2 rounded-2xl shadow-none">
          <CardContent className="py-2">
            {historyLoading ? (
              <div className="flex flex-col gap-2 py-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="vendas" className="divide-y">
                  {history!.sales.length === 0 && <EmptyHistory label="Nenhuma venda para este cliente." />}
                  {history!.sales.map((sale) => (
                    <HistoryRow
                      key={sale.id}
                      to={`/app/vendas/${sale.id}`}
                      title={sale.code}
                      meta={formatDate(sale.saleDate)}
                      value={formatCurrency(sale.totalValue)}
                      status={saleStatusMap[sale.status] ?? { label: sale.status, tone: 'neutral' }}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="cotacoes" className="divide-y">
                  {history!.quotes.length === 0 && <EmptyHistory label="Nenhuma cotação para este cliente." />}
                  {history!.quotes.map((quote) => (
                    <HistoryRow
                      key={quote.id}
                      title={quote.code}
                      meta={formatDate(quote.createdAt)}
                      value={formatCurrency(quote.totalValue)}
                      status={quoteStageMap[quote.stage] ?? { label: quote.stage, tone: 'neutral' }}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="contratos" className="divide-y">
                  {history!.contracts.length === 0 && <EmptyHistory label="Nenhum contrato para este cliente." />}
                  {history!.contracts.map((contract) => (
                    <HistoryRow
                      key={contract.id}
                      title={contract.code}
                      meta={formatDate(contract.createdAt)}
                      status={contractStatusMap[contract.status] ?? { label: contract.status, tone: 'neutral' }}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="vouchers" className="divide-y">
                  {history!.vouchers.length === 0 && <EmptyHistory label="Nenhum voucher para este cliente." />}
                  {history!.vouchers.map((voucher) => (
                    <HistoryRow
                      key={voucher.id}
                      title={`${voucher.code} · ${voucher.title}`}
                      meta={formatDate(voucher.createdAt)}
                      status={voucherStatusMap[voucher.status] ?? { label: voucher.status, tone: 'neutral' }}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="bilhetes" className="divide-y">
                  {history!.tickets.length === 0 && <EmptyHistory label="Nenhum bilhete para este cliente." />}
                  {history!.tickets.map((ticket) => (
                    <HistoryRow
                      key={ticket.id}
                      title={`${ticket.airline} · ${ticket.pnr.toUpperCase()}`}
                      meta={formatDate(ticket.createdAt)}
                      status={ticketStatusMap[ticket.status] ?? { label: ticket.status, tone: 'neutral' }}
                    />
                  ))}
                </TabsContent>
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
