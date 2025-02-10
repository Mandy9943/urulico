import ServiceCard from "@/app/(Home)/components/ServiceCard";
import { getServices } from "../actions";
import Pagination from "./Pagination";
const ITEMS_PER_PAGE = 12;

const ServicesList = async ({
  categoria,
  searchParams,
}: {
  categoria: string;
  searchParams: Promise<Record<string, string>>;
}) => {
  const queryString = new URLSearchParams({
    categoria,
    ...(await searchParams),
  }).toString();
  const { services, total } = await getServices(queryString);

  const currentPage = Number((await searchParams).page) || 1;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {services.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No se encontraron servicios
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            Intenta ajustar los filtros o realizar una nueva búsqueda
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={await searchParams}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ServicesList;
