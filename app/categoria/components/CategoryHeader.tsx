"use client";

import ServiceFilters from "@/components/ServiceFilters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";

interface Props {
  categoria: string;
}

export default function CategoryHeader({ categoria }: Props) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              Servicios en{" "}
              {categoria
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {isFiltersOpen ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {isFiltersOpen && (
            <div className="w-full pt-4 border-t border-gray-800/50">
              <ServiceFilters />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
