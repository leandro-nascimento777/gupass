import { NavLink } from 'react-router-dom'
import { quickActions } from './nav-config'

/** Barra de ações rápidas (verde, cheia largura) — ver referência real, abaixo do topbar. */
export function QuickActionsBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl bg-brand-primary px-6 py-3 text-white">
      {quickActions.map((action) => (
        <NavLink
          key={action.href}
          to={action.href}
          className="flex items-center gap-2 text-sm font-bold hover:opacity-80"
        >
          <action.icon className="size-4" />
          {action.label}
        </NavLink>
      ))}
    </div>
  )
}
