import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function ClientePublicoPage() {
  const { slug } = useParams()
  return <PlaceholderPage title="Cadastre-se" description={`Formulário público de captação de cliente — agência: ${slug}`} />
}
