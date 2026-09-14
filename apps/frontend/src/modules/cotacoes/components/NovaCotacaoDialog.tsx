import { useState } from 'react'
import { FileText, Search, User } from 'lucide-react'
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
 * ou pelo botão da própria página (nunca navega). Layout segue a referência
 * capturada: Nome/Telefone/Email SEMPRE visíveis nos dois modos — "Buscar
 * Cliente" só troca o campo Nome por um autocomplete que preenche
 * telefone/email a partir de um cliente existente; "Digitar" é o mesmo
 * conjunto de campos, mas em texto livre (lead sem cliente vinculado).
 * O botão final diz "Criar Cotação" em vez de "Continuar para Proposta" da
 * referência porque a montagem da proposta comercial ainda não foi
 * construída (etapa futura) — prometer uma continuação que não existe
 * seria pior que ajustar o rótulo.
 */
export function NovaCotacaoDialog() {
  const open = useUiStore((s) => s.novaCotacaoDialogOpen)
  const setOpen = useUiStore((s) => s.setNovaCotacaoDialogOpen)

  const [mode, setMode] = useState<'buscar' | 'digitar'>('buscar')
  const [clientId, setClientId] = useState<string | undefined>(undefined)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showMatches, setShowMatches] = useState(false)
  const [notes, setNotes] = useState('')
  const [ownerId, setOwnerId] = useState('atual')

  const { data: clientsData, isFetching: searchingClients } = useClients({
    q: name || undefined,
    page: 1,
    pageSize: 8,
  })
  const { data: membersData } = useAgencyMembers()
  const createQuote = useCreateQuote()

  const canSubmit = Boolean(name.trim())

  function reset() {
    setMode('buscar')
    setClientId(undefined)
    setName('')
    setPhone('')
    setEmail('')
    setShowMatches(false)
    setNotes('')
    setOwnerId('atual')
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    setOpen(next)
  }

  function selectClient(client: Client) {
    setClientId(client.id)
    setName(client.name)
    setPhone(client.phone ?? '')
    setEmail(client.email ?? '')
    setShowMatches(false)
  }

  function handleNameChange(value: string) {
    setName(value)
    if (clientId) setClientId(undefined) // digitando de novo desvincula o cliente selecionado
    if (mode === 'buscar') setShowMatches(Boolean(value))
  }

  async function handleSubmit() {
    if (!canSubmit) return
    const owner = ownerId !== 'atual' ? membersData?.data.find((m) => m.id === ownerId) : undefined
    await createQuote.mutateAsync({
      clientId,
      clientName: name.trim(),
      clientPhone: phone || undefined,
      clientEmail: email || undefined,
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
              <Label>Lead</Label>
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
                    setShowMatches(false)
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

            <div className="relative flex flex-col gap-2">
              <Input
                placeholder="Nome completo *"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => mode === 'buscar' && name && setShowMatches(true)}
              />
              {mode === 'buscar' && showMatches && (
                <div className="absolute top-full z-10 max-h-40 w-full overflow-y-auto rounded-lg border bg-popover shadow-md">
                  {searchingClients && <p className="p-2 text-sm text-muted-foreground">Buscando...</p>}
                  {!searchingClients && clientsData?.data.length === 0 && (
                    <p className="p-2 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
                  )}
                  {clientsData?.data.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {client.name}
                      {client.phone && <span className="ml-2 text-xs text-muted-foreground">{client.phone}</span>}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center overflow-hidden rounded-lg border">
                  <span className="border-r bg-muted px-2 py-1.5 text-xs font-medium text-muted-foreground">+55</span>
                  <input
                    className="w-full px-2 py-1.5 text-sm outline-none"
                    placeholder="(11) 91234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Input placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
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
