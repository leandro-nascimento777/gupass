import { useState } from 'react'
import { FileText, Search, User, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/lib/stores/ui-store'
import { useClients } from '@/modules/clientes/hooks/useClients'
import type { Client } from '@/types/entities'
import { useAgencyMembers } from '../hooks/useAgencyMembers'
import { useCreateQuote } from '../hooks/useQuotes'

const NOTES_MAX = 2000

/**
 * "Nova Cotação" — abre por cima da tela atual via atalho da QuickActionsBar
 * ou pelo botão da própria página (nunca navega). Comportamento confirmado
 * ao vivo em fixpass.com.br/app/cotacoes: "Buscar Cliente" é só uma busca —
 * ao selecionar, vira um card de cliente (avatar + nome + telefone·email +
 * remover), sem campos de telefone/email editáveis; "Digitar" é Nome +
 * Telefone(+55) + Email em texto livre. O rótulo da seção também muda de
 * "Lead" pra "Cliente" quando um cliente real é selecionado.
 * O botão final diz "Criar Cotação" em vez de "Continuar para Proposta" da
 * referência porque a montagem da proposta comercial ainda não foi
 * construída (etapa futura) — prometer uma continuação que não existe
 * seria pior que ajustar o rótulo.
 */
export function NovaCotacaoDialog() {
  const open = useUiStore((s) => s.novaCotacaoDialogOpen)
  const setOpen = useUiStore((s) => s.setNovaCotacaoDialogOpen)

  const [mode, setMode] = useState<'buscar' | 'digitar'>('buscar')
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [ownerId, setOwnerId] = useState('atual')

  const { data: clientsData, isFetching: searchingClients } = useClients({
    q: search || undefined,
    page: 1,
    pageSize: 8,
  })
  const { data: membersData } = useAgencyMembers()
  const createQuote = useCreateQuote()

  const clientName = mode === 'buscar' ? selectedClient?.name : leadName
  const canSubmit = Boolean(clientName?.trim())

  function reset() {
    setMode('buscar')
    setSearch('')
    setSelectedClient(null)
    setLeadName('')
    setLeadPhone('')
    setLeadEmail('')
    setNotes('')
    setOwnerId('atual')
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    setOpen(next)
  }

  async function handleSubmit() {
    if (!canSubmit) return
    const owner = ownerId !== 'atual' ? membersData?.data.find((m) => m.id === ownerId) : undefined
    await createQuote.mutateAsync({
      clientId: mode === 'buscar' ? selectedClient?.id : undefined,
      clientName: clientName!.trim(),
      clientPhone: mode === 'buscar' ? selectedClient?.phone : leadPhone || undefined,
      clientEmail: mode === 'buscar' ? selectedClient?.email : leadEmail || undefined,
      notes: notes || undefined,
      ownerId: owner?.id,
      ownerName: owner?.name,
    })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-5" />
          </div>
          <div className="text-left">
            <DialogTitle>Nova Cotação</DialogTitle>
            <DialogDescription>Informe os dados do lead para iniciar o processo de cotação.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{selectedClient ? 'Cliente' : 'Lead'}</Label>
              <div className="inline-flex items-center gap-1 rounded-full border bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setMode('buscar')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                    mode === 'buscar' ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  <Search className="size-3.5" /> Buscar Cliente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('digitar')
                    setSelectedClient(null)
                    setSearch('')
                  }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                    mode === 'digitar' ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  <User className="size-3.5" /> Digitar
                </button>
              </div>
            </div>

            {mode === 'buscar' ? (
              selectedClient ? (
                <div className="flex items-center gap-3 rounded-xl border bg-success/5 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold uppercase">{selectedClient.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[selectedClient.phone, selectedClient.email].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remover cliente selecionado"
                    onClick={() => setSelectedClient(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar cliente por nome, email ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-popover shadow-md">
                      {searchingClients && <p className="p-2 text-sm text-muted-foreground">Buscando...</p>}
                      {!searchingClients && clientsData?.data.length === 0 && (
                        <p className="p-2 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
                      )}
                      {clientsData?.data.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(client)
                            setSearch('')
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <User className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase">{client.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {[client.phone, client.email].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <Input placeholder="Nome completo *" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center overflow-hidden rounded-lg border">
                    <span className="border-r bg-muted px-2 py-1.5 text-xs font-medium text-muted-foreground">+55</span>
                    <input
                      className="w-full px-2 py-1.5 text-sm outline-none"
                      placeholder="(11) 91234-5678"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                    />
                  </div>
                  <Input placeholder="email@exemplo.com" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quote-notes">Observações</Label>
            <Textarea
              id="quote-notes"
              placeholder="Informações adicionais, preferências do cliente..."
              value={notes}
              maxLength={NOTES_MAX}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-right text-xs text-muted-foreground">
              {notes.length}/{NOTES_MAX}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Responsável</Label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atual">Manter como responsável atual</SelectItem>
                {membersData?.data.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t p-4">
          <Button onClick={handleSubmit} disabled={!canSubmit || createQuote.isPending}>
            Criar Cotação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
