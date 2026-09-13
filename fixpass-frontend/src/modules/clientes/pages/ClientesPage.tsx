import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchClientCategories } from '@/lib/api/clients'
import { useClients } from '../hooks/useClients'
import { ClientesTable } from '../components/ClientesTable'
import { NovoClienteDialog } from '../components/NovoClienteDialog'

export function ClientesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [wizardOpen, setWizardOpen] = useState(false)

  const { data, isLoading } = useClients({ page, pageSize, q: search || undefined })
  const { data: categoriesData } = useQuery({
    queryKey: ['client-categories', 'all'],
    queryFn: () => fetchClientCategories({}),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou documento..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="size-4" />
          Filtros
        </Button>
        <Button className="ml-auto" onClick={() => setWizardOpen(true)}>
          <UserPlus className="size-4" />
          Novo Cliente
        </Button>
      </div>

      <ClientesTable
        clients={data?.data ?? []}
        categories={categoriesData?.data ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      <NovoClienteDialog open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  )
}
