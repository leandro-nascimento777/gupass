import { useState } from 'react'
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
import { useCreateManagedLink } from '../hooks/usePublicLink'

interface NovoLinkGerenciavelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Dialog "Novo Link" — cria um link gerenciável (nome + UTM opcional). */
export function NovoLinkGerenciavelDialog({ open, onOpenChange }: NovoLinkGerenciavelDialogProps) {
  const [name, setName] = useState('')
  const [utmSource, setUtmSource] = useState('')
  const createLink = useCreateManagedLink()

  function reset() {
    setName('')
    setUtmSource('')
  }

  async function handleSubmit() {
    if (!name.trim()) return
    await createLink.mutateAsync({ name: name.trim(), utmSource: utmSource.trim() || undefined })
    reset()
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Novo Link</DialogTitle>
          <DialogDescription>Link permanente com nome e UTM de rastreamento.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="managed-link-name">Nome *</Label>
            <Input
              id="managed-link-name"
              placeholder="Ex: Representante João, Campanha Instagram..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="managed-link-utm">Origem / UTM (opcional)</Label>
            <Input
              id="managed-link-utm"
              placeholder="Ex: instagram, joao-representante..."
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim() || createLink.isPending}>
            Criar Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
