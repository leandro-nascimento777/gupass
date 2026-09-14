import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Copy, ExternalLink, Link2, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import type { PublicLinkTheme } from '@/types/entities'
import {
  useCreateTemporaryLink,
  useDeleteManagedLink,
  useDeleteTemporaryLink,
  usePublicLinkSettings,
  useUpdatePublicLinkSettings,
} from '../hooks/usePublicLink'
import { NovoLinkGerenciavelDialog } from '../components/NovoLinkGerenciavelDialog'
import { CamposFormularioDialog } from '../components/CamposFormularioDialog'

const MAX_MANAGED_LINKS = 5

const THEME_OPTIONS: { value: PublicLinkTheme; label: string; emoji: string }[] = [
  { value: 'classico', label: 'Clássico', emoji: '🏢' },
  { value: 'aviacao', label: 'Aviação', emoji: '✈️' },
  { value: 'nuvens', label: 'Nuvens', emoji: '☁️' },
]

const BACKGROUND_COLORS = ['#f8fafc', '#fef9c3', '#dbeafe', '#dcfce7', '#fce7f3', '#ede9fe']

function buildPublicUrl(slug: string) {
  return `${window.location.origin}/cliente/${slug}`
}

/**
 * O preview roda num iframe, que carrega o app de novo do zero — outro
 * contexto JS, com seu próprio mock em memória (MSW não é compartilhado entre
 * abas/iframes). Por isso o preview não veria uma troca de tema recém-salva
 * (o PATCH ficou só na aba admin). Passar tema/cor como querystring reflete a
 * edição em tempo real, mesmo antes de salvar — na prática, um preview melhor.
 */
function buildPreviewUrl(slug: string, theme: PublicLinkTheme, backgroundColor?: string) {
  const url = new URL(buildPublicUrl(slug))
  url.searchParams.set('previewTheme', theme)
  if (backgroundColor) url.searchParams.set('previewBg', backgroundColor)
  return url.toString()
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Link copiado.')
}

export function ClientesPublicLinkPage() {
  const { data: settings, isLoading } = usePublicLinkSettings()
  const updateSettings = useUpdatePublicLinkSettings()
  const deleteManagedLink = useDeleteManagedLink()
  const createTemporaryLink = useCreateTemporaryLink()
  const deleteTemporaryLink = useDeleteTemporaryLink()

  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false)
  const [theme, setTheme] = useState<PublicLinkTheme>('classico')
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined)
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme)
      setBackgroundColor(settings.backgroundColor)
    }
  }, [settings])

  if (isLoading || !settings) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  const permanentUrl = buildPublicUrl(settings.permanentSlug)
  const appearanceDirty = theme !== settings.theme || backgroundColor !== settings.backgroundColor

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-black">Página de Cadastro</h2>
          <p className="text-sm text-muted-foreground">Gerencie links, campos e aparência da página pública.</p>
        </div>

        <Card className="rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Link Permanente</CardTitle>
            <p className="text-sm text-muted-foreground">Link fixo da sua agência. Sempre acessível.</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-0 truncate rounded-lg border bg-muted px-3 py-2 text-sm">{permanentUrl}</code>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(permanentUrl)}>
              <Copy className="size-4" /> Copiar
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-none">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Links Gerenciáveis</CardTitle>
              <p className="text-sm text-muted-foreground">Links permanentes com nome, UTM e rastreamento.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                ({settings.managedLinks.length}/{MAX_MANAGED_LINKS})
              </span>
              <Button
                size="sm"
                onClick={() => setLinkDialogOpen(true)}
                disabled={settings.managedLinks.length >= MAX_MANAGED_LINKS}
              >
                <Plus className="size-4" /> Novo Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {settings.managedLinks.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-6 text-center text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Nenhum link gerenciável criado.</p>
                <p>Crie links para representantes, influenciadores ou campanhas.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {settings.managedLinks.map((link) => (
                  <li key={link.id} className="flex items-center justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{link.name}</span>
                        {link.utmSource && <Badge variant="outline">{link.utmSource}</Badge>}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{buildPublicUrl(link.slug)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Copiar link" onClick={() => copyToClipboard(buildPublicUrl(link.slug))}>
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Excluir link"
                        onClick={() => deleteManagedLink.mutate(link.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-none">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Links Temporários</CardTitle>
              <p className="text-sm text-muted-foreground">Cada link expira em 24h e é deletado após o uso.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => createTemporaryLink.mutate()} disabled={createTemporaryLink.isPending}>
              Gerar Link
            </Button>
          </CardHeader>
          <CardContent>
            {settings.temporaryLinks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Nenhum link ativo. Gere um novo acima.</p>
            ) : (
              <ul className="divide-y">
                {settings.temporaryLinks.map((link) => (
                  <li key={link.id} className="flex items-center justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{buildPublicUrl(link.slug)}</p>
                      <p className="text-xs text-muted-foreground">Expira em {formatDate(link.expiresAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Copiar link" onClick={() => copyToClipboard(buildPublicUrl(link.slug))}>
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Excluir link"
                        onClick={() => deleteTemporaryLink.mutate(link.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-none">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Campos do Formulário</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setFieldsDialogOpen(true)}>
              Configurar
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {settings.hiddenFields.length === 0
                ? 'Todos os campos visíveis'
                : `${settings.hiddenFields.length} campo(s) oculto(s)`}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Aparência</CardTitle>
            <p className="text-sm text-muted-foreground">Escolha um tema ou uma cor de fundo.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Tema</p>
              <div className="flex gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setTheme(opt.value)
                      setBackgroundColor(undefined)
                    }}
                    className={cn(
                      'flex flex-1 flex-col items-center gap-1 rounded-xl border p-3 text-sm font-medium',
                      theme === opt.value && !backgroundColor ? 'border-brand-dark bg-muted' : 'border-border',
                    )}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Cor de Fundo</p>
              <div className="flex flex-wrap gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBackgroundColor(color)}
                    className="size-8 rounded-full ring-offset-2 transition-shadow"
                    style={{ backgroundColor: color, boxShadow: backgroundColor === color ? '0 0 0 2px var(--brand-dark)' : undefined }}
                    aria-label={`Cor ${color}`}
                  />
                ))}
              </div>
            </div>

            <Button
              className="self-start"
              onClick={() => updateSettings.mutate({ theme, backgroundColor })}
              disabled={!appearanceDirty || updateSettings.isPending}
            >
              Salvar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-4">
        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex flex-col gap-2 py-4 text-sm">
            <p className="font-semibold">Como funciona:</p>
            <p className="text-muted-foreground">O cliente acessa o link e preenche seus dados cadastrais.</p>
            <p className="text-muted-foreground">O cadastro é criado automaticamente na sua lista de Clientes.</p>
            <p className="text-muted-foreground">Você economiza tempo de digitação e evita erros de cadastro.</p>
            <p className="mt-1 rounded-lg bg-brand-primary/10 p-2 text-brand-dark">
              💡 Dica: use links temporários para enviar a cada cliente. O permanente é ideal para redes sociais e sites.
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1 overflow-hidden rounded-2xl shadow-none">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="size-4" /> Preview
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Recarregar preview" onClick={() => setPreviewKey((k) => k + 1)}>
                <RefreshCcw className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Abrir em nova aba" asChild>
                <a href={permanentUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[600px] p-0">
            <iframe
              key={previewKey}
              src={buildPreviewUrl(settings.permanentSlug, theme, backgroundColor)}
              title="Preview do formulário público"
              className="size-full border-0"
            />
          </CardContent>
        </Card>
      </div>

      <NovoLinkGerenciavelDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen} />
      <CamposFormularioDialog open={fieldsDialogOpen} onOpenChange={setFieldsDialogOpen} hiddenFields={settings.hiddenFields} />
    </div>
  )
}
