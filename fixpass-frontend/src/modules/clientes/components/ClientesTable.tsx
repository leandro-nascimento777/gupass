import { useState } from 'react'
import { ArrowUpDown, Inbox, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { Client, ClientCategory } from '@/types/entities'
import { formatDate } from '@/lib/format'
import { useDeleteClient } from '../hooks/useClients'

interface ClientesTableProps {
  clients: Client[]
  categories: ClientCategory[]
  isLoading: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

/**
 * Tabela de clientes com colunas declarativas (sem @tanstack/react-table —
 * a lib mostrou um bug real de interação com Dialog nesta versão, travando o
 * app ao abrir o wizard "Novo Cliente"; mapeamento manual é suficiente aqui,
 * já que não usamos recursos avançados como resize/virtualização de colunas).
 */
export function ClientesTable({
  clients,
  categories,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ClientesTableProps) {
  const deleteClient = useDeleteClient()
  const [sortAsc, setSortAsc] = useState(true)

  const categoryById = new Map(categories.map((c) => [c.id, c]))

  const sortedClients = [...clients].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  )

  const columnCount = 8
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                <button
                  type="button"
                  className="flex items-center gap-1 font-medium"
                  onClick={() => setSortAsc((v) => !v)}
                >
                  Nome
                  <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Tipo</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Cidade/UF</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Email</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Telefone</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Categorias</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Cadastrado em</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && sortedClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="size-8" />
                    <p className="font-medium text-foreground">Nenhum cliente encontrado</p>
                    <p className="text-sm">Tente outro termo de busca.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              sortedClients.map((client) => {
                const cats = client.categoryIds
                  .map((id) => categoryById.get(id))
                  .filter(Boolean) as ClientCategory[]

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <NavLink to={`/app/clientes/${client.id}/ficha`} className="font-medium hover:underline">
                        {client.name}
                      </NavLink>
                    </TableCell>
                    <TableCell>{client.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</TableCell>
                    <TableCell>{client.city ? `${client.city}/${client.state ?? ''}` : '—'}</TableCell>
                    <TableCell>{client.email ?? '—'}</TableCell>
                    <TableCell>{client.phone ?? '—'}</TableCell>
                    <TableCell>
                      {cats.length === 0 ? (
                        '—'
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {cats.map((cat) => (
                            <Badge
                              key={cat.id}
                              variant="outline"
                              style={{ borderColor: cat.color, color: cat.color }}
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Mais ações">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <NavLink to={`/app/clientes/${client.id}/ficha`}>
                              <Pencil className="mr-2 size-4" /> Ver ficha
                            </NavLink>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteClient.mutate(client.id)}
                          >
                            <Trash2 className="mr-2 size-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{total} registro(s)</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Linhas</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(1)}>
              «
            </Button>
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              ‹
            </Button>
            <span className="px-2 tabular-nums">
              {page} / {pageCount}
            </span>
            <Button variant="outline" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
              ›
            </Button>
            <Button variant="outline" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(pageCount)}>
              »
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
