import { HttpResponse, http, type HttpHandler } from 'msw'
import { randomLatency, shouldSimulateError } from './config'

interface Identifiable {
  id: string
}

interface CrudOptions<T> {
  /** Campos de texto pesquisados pelo parâmetro `q`. */
  searchFields?: (keyof T)[]
  /** Campos que aceitam filtro exato via query string (ex: `?stage=nova`). */
  filterFields?: (keyof T)[]
  /** Tamanho de página default quando o cliente não informa `pageSize`. */
  defaultPageSize?: number
}

async function withNetworkSimulation<T>(fn: () => T): Promise<Response | T> {
  await new Promise((resolve) => setTimeout(resolve, randomLatency()))
  if (shouldSimulateError()) {
    return HttpResponse.json({ message: 'Erro simulado pelo mock — tente novamente.' }, { status: 500 })
  }
  return fn()
}

/**
 * Fábrica de handlers REST previsíveis (GET lista paginada+filtros, GET um,
 * POST, PATCH, DELETE) sobre um array mutável em memória — ver docs/API_CONTRACT.md.
 * `list` é passado por referência e mutado in-place (push/splice) para que as
 * mutations persistam durante a sessão do navegador.
 */
export function createCrudHandlers<T extends Identifiable>(
  basePath: string,
  list: T[],
  options: CrudOptions<T> = {},
): HttpHandler[] {
  const { searchFields = [], filterFields = [], defaultPageSize = 20 } = options

  return [
    http.get(basePath, async ({ request }) => {
      return withNetworkSimulation(() => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? defaultPageSize)
        const q = url.searchParams.get('q')?.toLowerCase().trim()

        let filtered = [...list]

        for (const field of filterFields) {
          const value = url.searchParams.get(String(field))
          if (value) {
            filtered = filtered.filter((item) => String(item[field]) === value)
          }
        }

        if (q && searchFields.length > 0) {
          filtered = filtered.filter((item) =>
            searchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(q)),
          )
        }

        const total = filtered.length
        const start = (page - 1) * pageSize
        const data = filtered.slice(start, start + pageSize)

        return HttpResponse.json({ data, page, pageSize, total })
      })
    }),

    http.get(`${basePath}/:id`, async ({ params }) => {
      return withNetworkSimulation(() => {
        const item = list.find((i) => i.id === params.id)
        if (!item) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        return HttpResponse.json(item)
      })
    }),

    http.post(basePath, async ({ request }) => {
      const body = (await request.json()) as Partial<T>
      return withNetworkSimulation(() => {
        const newItem = {
          id: `${basePath.split('/').pop()}-${crypto.randomUUID().slice(0, 8)}`,
          createdAt: new Date().toISOString(),
          ...body,
        } as unknown as T
        list.unshift(newItem)
        return HttpResponse.json(newItem, { status: 201 })
      })
    }),

    http.patch(`${basePath}/:id`, async ({ params, request }) => {
      const body = (await request.json()) as Partial<T>
      return withNetworkSimulation(() => {
        const index = list.findIndex((i) => i.id === params.id)
        if (index === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        list[index] = { ...list[index], ...body }
        return HttpResponse.json(list[index])
      })
    }),

    http.delete(`${basePath}/:id`, async ({ params }) => {
      return withNetworkSimulation(() => {
        const index = list.findIndex((i) => i.id === params.id)
        if (index === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        list.splice(index, 1)
        return new HttpResponse(null, { status: 204 })
      })
    }),
  ]
}
