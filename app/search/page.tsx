import ServiceHeader from "@/components/service-header";
import { Button } from "@/components/ui/button";
import { searchClient } from "@/lib/algolia";
import { NO_IMAGE, iconMap } from "@/utils/const";
import { Category, Service } from "@prisma/client";

import { BookOpen, Home, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchResults(query: string) {
  if (!query) return { services: [], categories: [] };

  const searchQuery = query.trim();

  const { results } = await searchClient.search({
    requests: [
      {
        indexName: "services_index",
        query: searchQuery,
        hitsPerPage: 20,
      },
      {
        indexName: "categories_index",
        query: searchQuery,
        hitsPerPage: 5,
      },
    ],
  });

  return {
    services: (results[0] as any).hits as (Service & { category: Category })[],
    categories: (results[1] as any).hits as Category[],
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || "";
  const { services, categories } = await searchResults(query);

  const noResults = services.length === 0 && categories.length === 0;
  return (
    <main className="min-h-screen bg-black text-white">
      <ServiceHeader initialQuery={query} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query ? (
          <>
            {!noResults && (
              <h1 className="text-2xl font-bold mb-8">
                Resultados para: &quot;{query}&quot;
              </h1>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Categorías</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.slug}`}
                      className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-violet-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {iconMap[category.icon] &&
                          React.createElement(iconMap[category.icon], {
                            className: "w-6 h-6",
                          })}
                        <div className="font-medium">
                          {(category as any)._highlightResult?.name ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (
                                  category as any
                                )._highlightResult.name.value.replace(
                                  /<em>/g,
                                  '<em class="text-yellow-400 not-italic">'
                                ),
                              }}
                            />
                          ) : (
                            category.name
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            {services.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servicio/${service.id}`}
                      className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-colors"
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={service.imagenes[0] || NO_IMAGE}
                          alt={service.titulo}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-violet-400 mb-2">
                          {(service as any)._highlightResult?.category?.name ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (
                                  service as any
                                )._highlightResult.category.name.value.replace(
                                  /<em>/g,
                                  '<em class="text-yellow-400 not-italic">'
                                ),
                              }}
                            />
                          ) : (
                            service.category.name
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {(service as any)._highlightResult?.titulo ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (
                                  service as any
                                )._highlightResult.titulo.value.replace(
                                  /<em>/g,
                                  '<em class="text-yellow-400 not-italic">'
                                ),
                              }}
                            />
                          ) : (
                            service.titulo
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {(service as any)._highlightResult?.descripcion ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (
                                  service as any
                                )._highlightResult.descripcion.value.replace(
                                  /<em>/g,
                                  '<em class="text-yellow-400 not-italic">'
                                ),
                              }}
                            />
                          ) : (
                            service.descripcion
                          )}
                        </p>
                        {service.precio && (
                          <div className="text-lg font-semibold text-green-400">
                            {service.precio.toLocaleString()} {service.moneda}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {noResults && (
              <div className="text-center py-24">
                <div className="max-w-md mx-auto">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-6" />
                  <h2 className="text-xl font-semibold mb-3">
                    No se encontraron resultados
                  </h2>
                  <p className="text-gray-400 mb-8">
                    No se encontraron servicios para &quot;{query}&quot;.
                    Intenta con otros términos de búsqueda o explora nuestras
                    categorías.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Volver al inicio
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/categorias">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Ver categorías
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              Ingresa un término de búsqueda para encontrar servicios
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
