import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUpdatePublicLinkSettings } from '../hooks/usePublicLink'
import { CONFIGURABLE_PUBLIC_FIELDS } from '../constants'

interface CamposFormularioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hiddenFields: string[]
}

export function CamposFormularioDialog({ open, onOpenChange, hiddenFields }: CamposFormularioDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(hiddenFields))
  const updateSettings = useUpdatePublicLinkSettings()

  useEffect(() => {
    if (open) setSelected(new Set(hiddenFields))
  }, [open, hiddenFields])

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleSave() {
    await updateSettings.mutateAsync({ hiddenFields: Array.from(selected) })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Campos do Formulário</DialogTitle>
          <DialogDescription>
            Desmarque os campos que não devem aparecer no formulário público. Nome e CPF/CNPJ são sempre exibidos.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {CONFIGURABLE_PUBLIC_FIELDS.map((field) => (
            <label key={field.key} className="flex items-center gap-2 text-sm">
              <Checkbox checked={!selected.has(field.key)} onCheckedChange={() => toggle(field.key)} />
              <Label className="font-normal">{field.label}</Label>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
