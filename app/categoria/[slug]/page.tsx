import CategoryPage from "../components/CategoryPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    departamento?: string;
    ciudad?: string;
    moneda?: string;
    precioMin?: string;
    precioMax?: string;
  }>;
}

export default async function Page({ params, searchParams }: Props) {
  return (
    <CategoryPage categoria={(await params).slug} searchParams={searchParams} />
  );
}
