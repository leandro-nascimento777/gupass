import { useState } from 'react'
import { Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ClientCategory } from '@/types/entities'
import { useClientCategories, useDeleteClientCategory } from '../hooks/useClientCategories'
import { CategoriaDialog } from '../components/CategoriaDialog'

export function ClientesCategoriasPage() {
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ClientCategory | null>(null)

  const { data, isLoading } = useClientCategories(search || undefined)
  const deleteCategory = useDeleteClientCategory()

  function openCreate() {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  function openEdit(category: ClientCategory) {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black">Categorias de Clientes</h2>
          <p className="text-sm text-muted-foreground">Organize seus clientes com tags visuais.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar categoria..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}

        {!isLoading && data?.data.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border py-12 text-center text-muted-foreground">
            <Tag className="size-8" />
            <p className="font-medium text-foreground">Nenhuma categoria encontrada</p>
          </div>
        )}

        {data?.data.map((category) => (
          <Card key={category.id} className="overflow-hidden rounded-xl border-t-4 shadow-none" style={{ borderTopColor: category.color }}>
            <CardContent className="flex items-start justify-between gap-2 py-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="font-semibold">{category.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{category.description || 'Sem descrição'}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar categoria" onClick={() => openEdit(category)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Excluir categoria"
                  onClick={() => deleteCategory.mutate(category.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoriaDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editingCategory} />
    </div>
  )
}
