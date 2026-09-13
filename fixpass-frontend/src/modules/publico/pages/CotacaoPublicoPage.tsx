import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function CotacaoPublicoPage() {
  const { slug } = useParams()
  return <PlaceholderPage title="Solicitar Cotação" description={`Formulário público de solicitação de cotação — agência: ${slug}`} />
}
