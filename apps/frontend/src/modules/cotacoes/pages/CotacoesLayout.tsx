import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FileText, Link2, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Cotações', href: '/app/cotacoes', icon: FileText },
  { label: 'Catálogo', href: '/app/cotacoes/catalog', icon: ShoppingBag },
  { label: 'Link Público', href: '/app/cotacoes/public-link', icon: Link2 },
]

/** Ver referência real: mesmo padrão de header+abas de ClientesLayout. */
export function CotacoesLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <FileText className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Cotações</h1>
          <p className="text-sm text-muted-foreground">Funil de vendas, catálogo de serviços e captação pública.</p>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.href
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              end
              className={cn(
                'flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground',
                isActive && 'border-brand-dark text-foreground',
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </NavLink>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
