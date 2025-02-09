import CategoryClient from '@/components/category-client';

// Lista de categorías para generateStaticParams
const categorias = [
  "instalacion-mantenimiento",
  "construccion-carpinteria",
  "servicios-domesticos",
  "salud-belleza",
  "artes-entretenimiento",
  "tecnologia-informatica",
  "servicios-profesionales",
  "educacion-tutorias",
  "transporte-mudanzas",
  "gastronomia-catering"
];

// Función requerida para generar las rutas estáticas
export function generateStaticParams() {
  return categorias.map((slug) => ({
    slug,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryClient slug={params.slug} />;
}