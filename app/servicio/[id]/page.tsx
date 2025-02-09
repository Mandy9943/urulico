import ServiceClient from '@/components/service-client';

// Lista de IDs de servicios para generateStaticParams
const servicios = [
  "1",
  "2",
  "3",
  "4"
];

// Función requerida para generar las rutas estáticas
export function generateStaticParams() {
  return servicios.map((id) => ({
    id,
  }));
}

export default function ServicePage({ params }: { params: { id: string } }) {
  return <ServiceClient id={params.id} />;
}