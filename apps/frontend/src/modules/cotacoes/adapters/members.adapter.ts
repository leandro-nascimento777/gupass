/**
 * Lista de membros da agência — usada aqui só pro seletor "Responsável" do
 * wizard "Nova Cotação". `/api/members` já existe (CRUD genérico), mas não
 * tem módulo dono ainda (a tela de Equipe em Configurações é placeholder);
 * quando esse módulo existir, mover este adapter pra lá.
 */
import { httpClient } from '@/lib/api/http-client'
import type { AgencyMember, Paginated } from '@/types/entities'

export const membersAdapter = {
  list(params: { q?: string; pageSize?: number } = {}) {
    return httpClient.get<Paginated<AgencyMember>>('/members', { pageSize: 100, ...params })
  },
}
