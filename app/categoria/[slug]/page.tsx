import { notFound } from "next/navigation";
import { getServices } from "../actions";
import CategoryPage from "../components/CategoryPage";

interface Props {
  params: { slug: string };
  searchParams: {
    page?: string;
    departamento?: string;
    ciudad?: string;
    moneda?: string;
    precioMin?: string;
    precioMax?: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  console.log(await params.slug);

  try {
    const queryString = new URLSearchParams({
      categoria: await params.slug,
      ...(await searchParams),
    }).toString();
    console.log(queryString);

    const { services, total } = await getServices(queryString);

    return (
      <CategoryPage
        categoria={params.slug}
        initialData={{ services, total }}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    notFound();
  }
}
