import ServiceCard from "@/app/(Home)/components/ServiceCard";
import { Service } from "../types";
import CategoryHeader from "./CategoryHeader";
import Pagination from "./Pagination";

interface Props {
  categoria: string;
  initialData: {
    services: Service[];
    total: number;
  };
  searchParams: Record<string, string>;
}

const ITEMS_PER_PAGE = 12;

export default function CategoryPage({
  categoria,
  initialData,
  searchParams,
}: Props) {
  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil(initialData.total / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-black text-white">
      <CategoryHeader categoria={categoria} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {initialData.services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
          />
        )}
      </div>
    </main>
  );
}
