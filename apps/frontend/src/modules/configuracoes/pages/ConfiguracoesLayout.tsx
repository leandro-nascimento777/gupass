import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Agência', href: '/app/configuracoes' },
  { label: 'Meu Perfil', href: '/app/configuracoes/profile' },
  { label: 'Equipe', href: '/app/configuracoes/users' },
  { label: 'Fornecedores', href: '/app/configuracoes/fornecedores' },
  { label: 'Email', href: '/app/configuracoes/email' },
  { label: 'Notificações', href: '/app/configuracoes/notifications' },
  { label: 'Comissões', href: '/app/configuracoes/comissoes' },
  { label: 'WhatsApp', href: '/app/configuracoes/whatsapp-templates' },
  { label: 'Segurança', href: '/app/configuracoes/security' },
]

export function ConfiguracoesLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Dados da agência, equipe, integrações e segurança.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.href
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              end
              className={cn(
                'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground',
                isActive && 'border-brand-primary text-foreground',
              )}
            >
              {tab.label}
            </NavLink>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
