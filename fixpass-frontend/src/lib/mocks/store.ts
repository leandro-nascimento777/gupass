/**
 * Cópias mutáveis dos dados semeados em seed.ts. Os handlers (ver handlers.ts)
 * leem/escrevem aqui — assim POST/PATCH/DELETE feitos na UI persistem durante
 * a sessão do navegador (recarregar a página reseta para o seed original).
 */
import * as seed from './seed'

export const db = {
  agency: { ...seed.agency },
  members: [...seed.members],
  clientCategories: [...seed.clientCategories],
  clients: [...seed.clients],
  quotes: [...seed.quotes],
  sales: [...seed.sales],
  tickets: [...seed.tickets],
  vouchers: [...seed.vouchers],
  transactions: [...seed.transactions],
  payables: [...seed.payables],
  bankAccounts: [...seed.bankAccounts],
  commissions: [...seed.commissions],
  goals: [...seed.goals],
  contracts: [...seed.contracts],
  receipts: [...seed.receipts],
  fiscalInvoices: [...seed.fiscalInvoices],
  whatsappTemplates: [...seed.whatsappTemplates],
  activityLog: [...seed.activityLog],
  suppliers: [...seed.suppliers],
  plans: [...seed.plans],
  subscription: { ...seed.subscription },
  tasks: [...seed.tasks],
  calendarEvents: [...seed.calendarEvents],
}
