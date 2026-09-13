import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { clientCategorySchema, type ClientCategoryFormValues } from '../validators/client-category.schema'
import type { ClientCategory } from '@/types/entities'
import { useCreateClientCategory, useUpdateClientCategory } from '../hooks/useClientCategories'

interface CategoriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: ClientCategory | null
}

const COLOR_OPTIONS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899']

export function CategoriaDialog({ open, onOpenChange, category }: CategoriaDialogProps) {
  const createCategory = useCreateClientCategory()
  const updateCategory = useUpdateClientCategory()
  const isEditing = Boolean(category)

  const form = useForm<ClientCategoryFormValues>({
    resolver: zodResolver(clientCategorySchema),
    defaultValues: { name: '', description: '', color: COLOR_OPTIONS[0] },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
        color: category?.color ?? COLOR_OPTIONS[0],
      })
    }
  }, [open, category, form])

  async function onSubmit(values: ClientCategoryFormValues) {
    if (isEditing && category) {
      await updateCategory.mutateAsync({ id: category.id, data: values })
    } else {
      await createCategory.mutateAsync(values)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>Organize seus clientes com tags visuais.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: VIP, Corporativo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className="size-7 rounded-full ring-offset-2 transition-shadow"
                        style={{
                          backgroundColor: color,
                          boxShadow: field.value === color ? `0 0 0 2px ${color}` : undefined,
                        }}
                        aria-label={`Cor ${color}`}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                {isEditing ? 'Salvar' : 'Criar Categoria'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
