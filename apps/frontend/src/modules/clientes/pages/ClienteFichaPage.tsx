import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  FileSignature,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Receipt as ReceiptIcon,
  Target,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/format'
import { contractStatusMap, quoteStageMap, saleStatusMap, ticketStatusMap } from '@/lib/status-maps'
import { useClientCategories } from '../hooks/useClientCategories'
import { useClient, useClientHistory } from '../hooks/useClientFicha'
import { useDeleteClient } from '../hooks/useClients'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function capitalize(value?: string) {
  if (!value) return undefined
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function FichaKpi({
  icon: Icon,
  label,
  value,
  tone = 'default',
}: {
  icon: typeof Wallet
  label: string
  value: string
  tone?: 'default' | 'success' | 'warning'
}) {
  const toneClass = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-foreground'
  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="flex items-center gap-3 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-dark">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className={`truncate text-lg font-black ${toneClass}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DataField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  )
}

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
    <Link to={to} className="-mx-2 block rounded-lg px-2 hover:bg-muted/50">
      {content}
    </Link>
  ) : (
    <div className="-mx-2 px-2">{content}</div>
  )
}

function EmptyHistory({ label }: { label: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{label}</p>
}

function QuickAction({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: typeof MessageCircle
  label: string
  href?: string
  onClick?: () => void
}) {
  const className = 'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted'
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <Icon className="size-4 text-muted-foreground" /> {label}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="size-4 text-muted-foreground" /> {label}
    </button>
  )
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
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
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
  const whatsappHref = client.phone ? `https://wa.me/${client.phone.replace(/\D/g, '')}` : undefined
  const telHref = client.phone ? `tel:${client.phone.replace(/\D/g, '')}` : undefined

  async function handleDelete() {
    if (!client) return
    await deleteClient.mutateAsync(client.id)
    navigate('/app/clientes')
  }

  function copyClientData() {
    if (!client) return
    const lines = [
      client.name,
      client.document,
      client.email,
      client.phone,
      client.city ? `${client.city}/${client.state ?? ''}` : undefined,
    ].filter(Boolean)
    navigator.clipboard.writeText(lines.join('\n'))
    toast.success('Dados copiados.')
  }

  function notBuiltYet() {
    toast.info('Módulo em construção — entra em uma próxima sessão.')
  }

  const kpis = history?.kpis
  const quotesCount = history?.quotes.length ?? 0
  const salesCount = history?.sales.length ?? 0
  const receiptsCount = history?.receipts.length ?? 0
  const contractsCount = history?.contracts.length ?? 0
  const ticketsCount = history?.tickets.length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/clientes">
            <ArrowLeft className="size-4" /> Clientes
          </Link>
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-brand-dark p-6 text-white">
        <div className="pointer-events-none absolute -top-12 -right-12 size-56 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-xl font-black">
              {getInitials(client.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black tracking-tight uppercase">{client.name}</h1>
                <Badge className="bg-white/15 text-white hover:bg-white/15">{client.personType}</Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                {client.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5" /> {client.email}
                  </span>
                )}
                {client.phone && (
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="size-3.5 text-[#25D366]" /> {client.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Cliente desde {formatMonthYear(client.createdAt)}
                </span>
              </div>
              {categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <Badge key={cat!.id} className="bg-white/15 text-white hover:bg-white/15">
                      {cat!.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm">
              <Pencil className="size-4" /> Editar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteClient.isPending}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {historyLoading || !kpis ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FichaKpi icon={Wallet} label="Faturamento (LTV)" value={formatCurrency(kpis.ltv)} />
          <FichaKpi icon={TrendingUp} label="Lucro Estimado" value={formatCurrency(kpis.estimatedProfit)} tone="success" />
          <FichaKpi icon={Target} label="Ticket Médio" value={formatCurrency(kpis.averageTicket)} />
          <FichaKpi
            icon={Clock}
            label="Última Movimentação"
            value={kpis.lastMovementAt ? formatDate(kpis.lastMovementAt) : '—'}
            tone="warning"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px] lg:items-start">
        <Tabs defaultValue="dados">
          <TabsList>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="viagens">
              Viagens {ticketsCount > 0 && <span className="ml-1">{ticketsCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="cotacoes">
              Cotações {quotesCount > 0 && <span className="ml-1">{quotesCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="vendas">
              Vendas {salesCount > 0 && <span className="ml-1">{salesCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="recibos">
              Recibos {receiptsCount > 0 && <span className="ml-1">{receiptsCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="contratos">
              Contratos {contractsCount > 0 && <span className="ml-1">{contractsCount}</span>}
            </TabsTrigger>
          </TabsList>

          <Card className="mt-2 rounded-2xl shadow-none">
            <CardContent className="py-2">
              <TabsContent value="dados" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center gap-2 border-b pb-2">
                    <User className="size-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Dados Pessoais</h3>
                  </div>
                  <DataField label="Nome" value={client.name} />
                  <DataField label="CPF" value={client.document} />
                  <DataField label="Nascimento" value={client.birthDate && formatDate(client.birthDate)} />
                  <DataField label="Nacionalidade" value={client.nationality} />
                  <DataField label="Sexo" value={capitalize(client.gender)} />
                  <DataField label="RG" value={client.rg} />
                </div>

                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center gap-2 border-b pb-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Contato</h3>
                  </div>
                  <DataField label="Email" value={client.email} />
                  <DataField label="Telefone" value={client.phone} />
                  <DataField label="Origem" value={client.sourceChannel} />
                </div>

                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center gap-2 border-b pb-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Endereço</h3>
                  </div>
                  <DataField label="Logradouro" value={client.street ? `${client.street}, ${client.addressNumber ?? ''}` : undefined} />
                  <DataField label="Bairro" value={client.neighborhood} />
                  <DataField label="Cidade/UF" value={client.city ? `${client.city} / ${client.state ?? ''}` : undefined} />
                  <DataField label="CEP" value={client.zipCode} />
                </div>

                <div className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center gap-2 border-b pb-2">
                    <Globe className="size-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Passaporte</h3>
                  </div>
                  <DataField label="Número" value={client.passportNumber} />
                  <DataField label="Validade" value={client.passportExpiry && formatDate(client.passportExpiry)} />
                  <DataField label="País Emissor" value={client.passportCountry} />
                </div>
              </TabsContent>

              <TabsContent value="viagens" className="divide-y">
                {ticketsCount === 0 && <EmptyHistory label="Nenhuma viagem para este cliente." />}
                {history?.tickets.map((ticket) => (
                  <HistoryRow
                    key={ticket.id}
                    title={`${ticket.airline} · ${ticket.pnr.toUpperCase()}`}
                    meta={formatDate(ticket.createdAt)}
                    status={ticketStatusMap[ticket.status] ?? { label: ticket.status, tone: 'neutral' }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="cotacoes" className="divide-y">
                {quotesCount === 0 && <EmptyHistory label="Nenhuma cotação para este cliente." />}
                {history?.quotes.map((quote) => (
                  <HistoryRow
                    key={quote.id}
                    title={quote.code}
                    meta={formatDate(quote.createdAt)}
                    value={formatCurrency(quote.totalValue)}
                    status={quoteStageMap[quote.stage] ?? { label: quote.stage, tone: 'neutral' }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="vendas" className="divide-y">
                {salesCount === 0 && <EmptyHistory label="Nenhuma venda para este cliente." />}
                {history?.sales.map((sale) => (
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

              <TabsContent value="recibos" className="divide-y">
                {receiptsCount === 0 && <EmptyHistory label="Nenhum recibo para este cliente." />}
                {history?.receipts.map((receipt) => (
                  <HistoryRow
                    key={receipt.id}
                    title={receipt.code}
                    meta={`${formatDate(receipt.issuedAt)} · ${receipt.paymentMethod}`}
                    value={formatCurrency(receipt.value)}
                    status={{ label: 'Emitido', tone: 'success' }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="contratos" className="divide-y">
                {contractsCount === 0 && <EmptyHistory label="Nenhum contrato para este cliente." />}
                {history?.contracts.map((contract) => (
                  <HistoryRow
                    key={contract.id}
                    title={contract.code}
                    meta={formatDate(contract.createdAt)}
                    status={contractStatusMap[contract.status] ?? { label: contract.status, tone: 'neutral' }}
                  />
                ))}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <Card className="rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-sm tracking-wide text-muted-foreground uppercase">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0.5">
            <QuickAction icon={MessageCircle} label="WhatsApp" href={whatsappHref} />
            <QuickAction icon={Phone} label="Ligar" href={telHref} />
            <QuickAction icon={Copy} label="Copiar Dados" onClick={copyClientData} />
            <QuickAction icon={FileSignature} label="Gerar Contrato" onClick={notBuiltYet} />
            <QuickAction icon={ReceiptIcon} label="Emitir Recibo" onClick={notBuiltYet} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
