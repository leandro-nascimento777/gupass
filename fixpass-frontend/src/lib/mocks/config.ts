/**
 * Configuração runtime do mock (MSW). Exposta em `window.__mockConfig` em dev
 * para o time poder forçar estados de erro/latência manualmente ao validar telas
 * (ver SPEC_INICIO_PROJETO_FIXPASS_CLONE.md, Tarefa 3, item 3).
 */
export const mockConfig = {
  /** Probabilidade (0–1) de qualquer request simulada falhar com 500. */
  errorRate: 0,
  /** Latência artificial mínima/máxima em ms para simular rede real. */
  latency: { min: 150, max: 500 },
}

if (typeof window !== 'undefined') {
  ;(window as unknown as { __mockConfig: typeof mockConfig }).__mockConfig = mockConfig
}

export function randomLatency() {
  const { min, max } = mockConfig.latency
  return Math.round(min + Math.random() * (max - min))
}

export function shouldSimulateError() {
  return Math.random() < mockConfig.errorRate
}
