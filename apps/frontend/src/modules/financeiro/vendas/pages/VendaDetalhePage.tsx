import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function VendaDetalhePage() {
  const { id } = useParams()
  return <PlaceholderPage title={`Venda ${id ?? ''}`} description="Pagamentos, itens da venda e nota fiscal de serviço." />
}
