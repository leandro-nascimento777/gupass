import { Outlet } from 'react-router-dom'
import { Logo } from './Logo'

/** Layout para telas de login e páginas públicas (sem topbar/navegação autenticada). */
export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
      <div className="mb-6">
        <Logo />
      </div>
      <Outlet />
    </div>
  )
}
