"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { TransformedCategory } from "../page";

export default function SearchBar({
  categories,
}: {
  categories: TransformedCategory[];
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8 max-w-2xl mx-auto relative">
      <div
        className={`flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-xl border ${
          searchFocused
            ? "border-violet-500 shadow-lg shadow-violet-500/20"
            : "border-gray-800"
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-2 p-4">
          <Search
            className={`w-5 h-5 ${
              searchFocused ? "text-violet-400" : "text-gray-400"
            } transition-colors`}
          />
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-500"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-800"></div>
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2">
              <span className="hidden sm:inline">Buscar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {searchFocused && (
          <div className="border-t border-gray-800 max-h-[300px] overflow-y-auto">
            <div className="p-2">
              {searchQuery && filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <Link
                    href={`/categoria?categoria=${category.slug}`}
                    key={category.slug}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {category.icon}
                    </div>
                    <span>{category.name}</span>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-sm">
                  Sugerencias populares:
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((category) => (
                      <Link
                        href={`/categoria?categoria=${category.slug}`}
                        key={category.slug}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800/50 hover:bg-gray-800 rounded-full text-sm transition-colors"
                      >
                        {category.icon}
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
