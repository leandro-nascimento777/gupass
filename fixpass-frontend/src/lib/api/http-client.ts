/**
 * Client HTTP isolado — todo acesso a dados passa por aqui (nunca fetch solto em
 * componente, ver SPEC_INICIO_PROJETO_FIXPASS_CLONE.md seção 1 e 6).
 * Em dev, as requisições são interceptadas pelo MSW (ver lib/mocks). Quando o
 * backend real existir, basta trocar API_BASE_URL — nenhum componente muda.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number
  info?: unknown

  constructor(message: string, status: number, info?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.info = info
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return `${url.pathname}${url.search}`
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers, ...rest } = options

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let info: unknown
    try {
      info = await response.json()
    } catch {
      info = undefined
    }
    throw new ApiError(
      (info as { message?: string })?.message ?? `Erro ${response.status} ao acessar ${path}`,
      response.status,
      info,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const httpClient = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>(path, { method: 'GET', params }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
