/**
 * Simula consultas a serviços externos (Receita Federal/CNPJ, CEP tipo ViaCEP)
 * usadas para autofill nos formulários de cliente. É "regra de negócio" no
 * sentido de decidir o que a tela deve fazer com uma consulta — por isso vive
 * no service, não dentro do componente. O resultado é mockado (o frontend não
 * implementa a integração real, só simula o retorno — ver SPEC seção 6);
 * quando o backend existir, só o corpo destas funções muda.
 */

async function delay(ms = 600) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export interface CpfLookupResult {
  nomeCompleto: string
  dataNascimento: string
  sexo: string
}

export async function lookupCpf(_cpf: string): Promise<CpfLookupResult> {
  await delay()
  return {
    nomeCompleto: 'Leandro Theodoro Nascimento',
    dataNascimento: '1987-12-11',
    sexo: 'masculino',
  }
}

export interface CnpjLookupResult {
  razaoSocial: string
  nomeFantasia: string
  telefone: string
  email: string
}

export async function lookupCnpj(_cnpj: string): Promise<CnpjLookupResult> {
  await delay()
  return {
    razaoSocial: 'Vai de Tur Viagens e Turismo Ltda',
    nomeFantasia: 'Vai de Tur',
    telefone: '+55 11 91234-5678',
    email: 'contato@vaidetur.com.br',
  }
}

export interface CepLookupResult {
  bairro: string
  logradouro: string
  cidade: string
  estado: string
}

export async function lookupCep(cep: string | undefined): Promise<CepLookupResult | null> {
  if (!cep || cep.replace(/\D/g, '').length < 8) return null
  await delay()
  return {
    bairro: 'Loteamento Residencial Viva Vista',
    logradouro: 'Avenida José Carlos Amaral',
    cidade: 'Sumaré',
    estado: 'São Paulo (SP)',
  }
}
