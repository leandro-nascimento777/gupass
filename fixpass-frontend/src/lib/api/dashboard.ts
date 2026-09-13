import { httpClient } from './http-client'
import type { DashboardKpis } from '@/types/entities'

export type DashboardPeriod = 'hoje' | 'ontem' | 'semana' | 'mes' | 'ano'

export function fetchDashboardKpis(period: DashboardPeriod) {
  return httpClient.get<DashboardKpis>('/dashboard', { period })
}
