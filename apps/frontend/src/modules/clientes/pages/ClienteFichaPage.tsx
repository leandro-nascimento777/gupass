import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function ClienteFichaPage() {
  const { id } = useParams()
  return <PlaceholderPage title={`Ficha do Cliente ${id ? `#${id}` : ''}`} description="Histórico consolidado: vendas, cotações, contratos, vouchers e bilhetes." />
}
