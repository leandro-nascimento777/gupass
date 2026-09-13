import { useQuery } from '@tanstack/react-query'
import { fetchDashboardKpis, type DashboardPeriod } from '@/lib/api/dashboard'

export function useDashboardKpis(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => fetchDashboardKpis(period),
  })
}
