import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description?: string
  icon?: LucideIcon
}

/**
 * Placeholder para módulos ainda não construídos (ver MAPEAMENTO_TELAS.md,
 * seção 23, para a ordem de prioridade). Mantém a rota navegável desde já.
 */
export function PlaceholderPage({ title, description, icon: Icon = Construction }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <Icon className="size-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-base font-semibold text-muted-foreground">Em construção</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Esta tela ainda não foi implementada nesta sprint. Ver MAPEAMENTO_TELAS.md para a ordem de prioridade.
        </CardContent>
      </Card>
    </div>
  )
}
