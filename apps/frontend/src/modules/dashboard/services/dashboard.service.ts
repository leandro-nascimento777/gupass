import { dashboardAdapter, type DashboardPeriod } from '../adapters/dashboard.adapter'

export type { DashboardPeriod }

export function getDashboardKpis(period: DashboardPeriod) {
  return dashboardAdapter.fetchKpis(period)
}
