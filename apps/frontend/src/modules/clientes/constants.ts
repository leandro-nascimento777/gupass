/** Campos opcionais do formulário público de clientes — Nome e CPF/CNPJ são
 * sempre obrigatórios, por isso não entram aqui (ver Link Público, seção 5.5). */
export const CONFIGURABLE_PUBLIC_FIELDS = [
  { key: 'email', label: 'E-mail' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'dataNascimento', label: 'Data de Nascimento' },
  { key: 'nacionalidade', label: 'Nacionalidade' },
  { key: 'sexo', label: 'Sexo' },
  { key: 'rg', label: 'RG' },
  { key: 'origemFonte', label: 'Origem / Fonte' },
] as const
