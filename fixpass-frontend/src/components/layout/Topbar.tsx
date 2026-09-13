import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Bell, ChevronRight, LogOut, Menu, Moon, Search, Settings, Sun, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUiStore } from '@/lib/stores/ui-store'
import { useTheme } from '@/lib/hooks/useTheme'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { FullNavSheet } from './FullNavSheet'
import { topNavMenus, type TopNavLeaf } from './nav-config'

function isLeaf(item: TopNavLeaf | { children: TopNavLeaf[] }): item is TopNavLeaf {
  return 'href' in item
}

export function Topbar() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { data: subscription } = useSubscription()

  return (
    <>
      <header className="sticky top-4 z-30 mx-auto flex w-[min(1280px,calc(100%-2rem))] items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-sm">
        <NavLink to="/app" className="mr-2">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          <Button
            variant={location.pathname === '/app' ? 'default' : 'ghost'}
            size="sm"
            className={cn('rounded-full', location.pathname === '/app' && 'bg-brand-dark text-white hover:bg-brand-dark/90')}
            asChild
          >
            <NavLink to="/app">Dashboard</NavLink>
          </Button>

          {topNavMenus.map((menu) => (
            <DropdownMenu key={menu.label}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  {menu.label}
                  <ChevronRight className="size-3.5 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {menu.items.map((item) =>
                  isLeaf(item) ? (
                    <DropdownMenuItem key={item.href} asChild disabled={item.locked}>
                      <NavLink to={item.href} className="gap-2">
                        <item.icon className="size-4 text-brand-dark" />
                        {item.label}
                        {item.locked && <span className="ml-auto text-xs text-muted-foreground">🔒</span>}
                      </NavLink>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuSub key={item.label}>
                      <DropdownMenuSubTrigger className="gap-2">
                        <item.icon className="size-4 text-brand-dark" />
                        {item.label}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.href} asChild>
                            <NavLink to={child.href} className="gap-2">
                              <child.icon className="size-4 text-brand-dark" />
                              {child.label}
                            </NavLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Busca global"
        >
          <Search className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notificações">
              <Bell className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              Nenhuma notificação por aqui ainda.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        {subscription?.status === 'trial' && (
          <Badge className="rounded-full bg-brand-primary/15 text-brand-dark hover:bg-brand-primary/15">TESTE</Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Minha conta">
              <UserIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/app/configuracoes/profile">
                <UserIcon className="mr-2 size-4" /> Meu Perfil
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/app/configuracoes">
                <Settings className="mr-2 size-4" /> Configurações
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/login">
                <LogOut className="mr-2 size-4" /> Sair da conta
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setNavOpen(true)}
          aria-label="Abrir navegação completa"
        >
          <Menu className="size-4" />
        </Button>
      </header>

      <FullNavSheet open={navOpen} onOpenChange={setNavOpen} />
    </>
  )
}
