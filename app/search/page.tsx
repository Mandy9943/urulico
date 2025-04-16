import ServiceHeader from "@/components/service-header";
import { Button } from "@/components/ui/button";
import { searchClient } from "@/lib/algolia";
import { NO_IMAGE, iconMap } from "@/utils/const";
import { Category, Service } from "@prisma/client";

import { Home, LucideProps, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchResults(query: string) {
  const searchQuery = query ? query.trim() : ""; // Keep empty string if no query

  // Perform search even if query is empty to get default results (e.g., recent)
  const { results } = await searchClient.search({
    requests: [
      {
        indexName: "services_index",
        query: searchQuery,
        hitsPerPage: 20, // Limit initial results
      },
      {
        indexName: "categories_index",
        query: searchQuery, // Search categories only if there's a query
        hitsPerPage: searchQuery ? 5 : 0, // Don't fetch categories if query is empty
      },
    ],
  });

  return {
    services: (results[0] as any).hits as (Service & { category: Category })[],
    // Ensure categories is an empty array if no query was made
    categories: searchQuery ? ((results[1] as any).hits as Category[]) : [],
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || "";
  const { services, categories } = await searchResults(query);

  const noResults = services.length === 0 && categories.length === 0 && !!query; // Check query exists for no results
  const showInitialResults = !query && services.length > 0; // Flag for initial view

  const renderIcon = (
    iconName: string
  ): React.ReactElement<LucideProps> | null => {
    const IconComponent = iconMap[iconName];
    return IconComponent
      ? React.createElement(IconComponent, { className: "w-6 h-6" })
      : null;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <ServiceHeader initialQuery={query} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show title based on whether it's a search result or initial view */}
        <h1 className="text-2xl font-bold mb-8">
          {query ? `Resultados para: "${query}"` : "Servicios Recientes"}
        </h1>

        {/* Main Content Area */}
        {(!noResults || showInitialResults) && services.length > 0 ? (
          <div className="flex flex-col gap-12">
            {/* Categories Section - Only show if query exists and categories found */}
            {query && categories.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Categorías</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.slug}`}
                      className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-violet-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {renderIcon(category.icon)}
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
              </section>
            )}

            {/* Services Section - Show if services found (initial or search results) */}
            {services.length > 0 && (
              <section>
                {query && (
                  <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servicio/${service.id}`}
                      className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-colors flex flex-col"
                    >
                      <div className="aspect-square relative w-full">
                        <Image
                          src={service.imagenes?.[0] || NO_IMAGE}
                          alt={service.titulo}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
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
                            service.category?.name || "Sin categoría"
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2 flex-grow">
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
                            service.descripcion || "Sin descripción"
                          )}
                        </p>
                        {service.precio != null && (
                          <div className="text-lg font-semibold text-emerald-400 mt-auto pt-2">
                            {`${
                              service.moneda || "$"
                            } ${service.precio.toLocaleString()}`}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* No Results Message - Only show if a query was made and nothing was found */
          noResults && (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-6" />
                <h2 className="text-xl font-semibold mb-3">
                  No se encontraron resultados
                </h2>
                <p className="text-gray-400 mb-8">
                  No se encontraron servicios ni categorías para "{query}".
                  Intenta con otros términos de búsqueda.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Volver al inicio
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
