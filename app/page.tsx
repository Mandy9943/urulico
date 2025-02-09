"use client";

import { ArrowRight, Search, PlusCircle, Sparkles, Shield, Zap, Hammer, Home, Heart, Palette, Computer, BookOpen, Truck, ChefHat, Wrench, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Instalación y Mantenimiento",
    slug: "instalacion-mantenimiento",
    icon: <Wrench className="w-6 h-6 text-violet-400" />
  },
  {
    name: "Construcción y Carpintería",
    slug: "construccion-carpinteria",
    icon: <Hammer className="w-6 h-6 text-orange-400" />
  },
  {
    name: "Servicios Domésticos",
    slug: "servicios-domesticos",
    icon: <Home className="w-6 h-6 text-green-400" />
  },
  {
    name: "Salud y Belleza",
    slug: "salud-belleza",
    icon: <Heart className="w-6 h-6 text-pink-400" />
  },
  {
    name: "Artes y Entretenimiento",
    slug: "artes-entretenimiento",
    icon: <Palette className="w-6 h-6 text-purple-400" />
  },
  {
    name: "Tecnología e Informática",
    slug: "tecnologia-informatica",
    icon: <Computer className="w-6 h-6 text-blue-400" />
  },
  {
    name: "Servicios Profesionales",
    slug: "servicios-profesionales",
    icon: <Shield className="w-6 h-6 text-emerald-400" />
  },
  {
    name: "Educación y Tutorías",
    slug: "educacion-tutorias",
    icon: <BookOpen className="w-6 h-6 text-yellow-400" />
  },
  {
    name: "Transporte y Mudanzas",
    slug: "transporte-mudanzas",
    icon: <Truck className="w-6 h-6 text-red-400" />
  },
  {
    name: "Gastronomía y Catering",
    slug: "gastronomia-catering",
    icon: <ChefHat className="w-6 h-6 text-amber-400" />
  }
];

export default function LandingPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="font-syne text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-emerald-400 tracking-tight">
              Urulico
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Tu plataforma de anuncios y servicios en Uruguay. Publica y encuentra servicios de manera rápida y sencilla.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto relative">
              <div className={`flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-xl border ${searchFocused ? 'border-violet-500 shadow-lg shadow-violet-500/20' : 'border-gray-800'} transition-all duration-300`}>
                {/* Main Search Input */}
                <div className="flex items-center gap-2 p-4">
                  <Search className={`w-5 h-5 ${searchFocused ? 'text-violet-400' : 'text-gray-400'} transition-colors`} />
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

                {/* Search Suggestions */}
                {searchFocused && (
                  <div className="border-t border-gray-800 max-h-[300px] overflow-y-auto">
                    <div className="p-2">
                      {searchQuery && filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <Link
                            href={`/categoria/${category.slug}`}
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
                                href={`/categoria/${category.slug}`}
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
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                href={`/categoria/${category.slug}`}
                key={category.slug}
                className="group p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-violet-500 transition-all"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
          
      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Ofreces un Servicio?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Publica tu anuncio gratis y conecta con personas que buscan tus servicios.
          </p>
          <button 
            onClick={() => window.location.href = '/publicar'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Publicar Anuncio
          </button>
        </div>
      </section>
    </main>
  );
}