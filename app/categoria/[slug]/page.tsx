import { notFound } from "next/navigation";
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
  try {
    return (
      <CategoryPage
        categoria={(await params).slug}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    notFound();
  }
}
