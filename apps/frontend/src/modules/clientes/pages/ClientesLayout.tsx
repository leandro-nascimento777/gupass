import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Link2, Tag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Clientes', href: '/app/clientes', icon: Users },
  { label: 'Categorias', href: '/app/clientes/categories', icon: Tag },
  { label: 'Link Público', href: '/app/clientes/public-link', icon: Link2 },
]

/** Ver referência real: header com ícone + título/subtítulo, abas sublinhadas. */
export function ClientesLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Users className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie sua base de clientes, categorias e captação.</p>
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
