"use client";

import ServiceCard from "@/app/(Home)/components/ServiceCard";
import ServiceFilters from "@/components/ServiceFilters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Service, useServices } from "../hooks/useServices";

const ITEMS_PER_PAGE = 12;

export default function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");
  const currentPage = Number(searchParams.get("page")) || 1;

  const { services, total, isLoading } = useServices(searchParams.toString());
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!categoria) {
      router.push("/");
    }
  }, [categoria, router]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/categoria?${params.toString()}`);
  };

  if (!categoria) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold">
                Servicios en{" "}
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </h1>
            </div>

            <div className="w-full">
              <ServiceFilters />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center text-gray-400">Cargando servicios...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service: Service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
