import { NavLink, useLocation } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/modules/auth/hooks/useLogout'
import { Logo } from './Logo'
import { navGroups } from './nav-config'

interface FullNavSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Menu lateral completo (doc seção 3.1), aberto pelo hamburger do topbar. */
export function FullNavSheet({ open, onOpenChange }: FullNavSheetProps) {
  const location = useLocation()
  const logout = useLogout()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 gap-0 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/app'
                      ? location.pathname === '/app'
                      : location.pathname.startsWith(item.href.split('?')[0])
                  return (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted',
                          isActive && 'bg-brand-dark text-white hover:bg-brand-dark/90',
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              item.badge === 'BETA'
                                ? 'border-blue-300 bg-blue-50 text-blue-700'
                                : 'border-amber-300 bg-amber-50 text-amber-700',
                              isActive && 'border-white/40 bg-white/10 text-white',
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t p-2">
          <button
            type="button"
            onClick={() => {
              logout()
              onOpenChange(false)
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Sair da conta
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
