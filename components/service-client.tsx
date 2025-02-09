"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Category, Service } from "@prisma/client";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Imágenes por defecto
const NO_IMAGE =
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=600&fit=crop";
const ERROR_IMAGE =
  "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&h=600&fit=crop";

interface ServicioConCategory extends Service {
  category: Category;
}

interface ServicioRelacionado {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number | null;
  moneda: string | null;
  imagen: string | null;
  tieneImagenes: boolean;
}

interface ServiceClientProps {
  servicio: ServicioConCategory;
  serviciosRelacionados: ServicioRelacionado[];
}

function ServiceImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const imageSource = error ? ERROR_IMAGE : src || NO_IMAGE;

  return (
    <Image
      src={imageSource}
      alt={alt}
      width={800}
      height={600}
      className="rounded-lg object-cover w-full max-h-[500px]"
      onError={() => setError(true)}
    />
  );
}

export default function ServiceClient({
  servicio,
  serviciosRelacionados,
}: ServiceClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" asChild className="shrink-0">
              <Link href={`/categoria/${servicio.category.slug}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="shrink-0">
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>
              <span className="hidden sm:inline mr-2">Buscar</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild className="bg-violet-600 hover:bg-violet-700">
              <Link href="/publicar">
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Publicar anuncio</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <ServiceImage
                src={servicio.imagenes[selectedImage]}
                alt={`${servicio.titulo} - Imagen ${selectedImage + 1}`}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {servicio.imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square relative rounded-lg overflow-hidden",
                    selectedImage === index && "ring-2 ring-violet-500"
                  )}
                >
                  <ServiceImage
                    src={imagen}
                    alt={`${servicio.titulo} - Miniatura ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del servicio */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{servicio.titulo}</h1>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span>
                  {servicio.ciudad}, {servicio.departamento}
                </span>
              </div>
              {servicio.precio && (
                <div className="text-2xl font-bold text-green-400">
                  {servicio.precio.toLocaleString()} {servicio.moneda}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Descripción</h2>
              <p className="text-gray-400 whitespace-pre-line">
                {servicio.descripcion}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Proveedor</h2>
              <p className="text-lg">{servicio.proveedor}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicio.whatsapp && servicio.telefonoPrincipal && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link
                      href={`https://wa.me/${servicio.telefonoPrincipal.replace(
                        /\s+/g,
                        ""
                      )}`}
                      target="_blank"
                    >
                      WhatsApp
                    </Link>
                  </Button>
                )}
                {servicio.telefonoPrincipal && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`tel:${servicio.telefonoPrincipal.replace(
                        /\s+/g,
                        ""
                      )}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full sm:col-span-2"
                  asChild
                >
                  <Link href={`mailto:${servicio.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar email
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Servicios relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviciosRelacionados.map((servicio) => (
              <Link
                key={servicio.id}
                href={`/servicio/${servicio.id}`}
                className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-colors"
              >
                <div className="aspect-4/3 relative">
                  <ServiceImage
                    src={servicio.imagen || ""}
                    alt={servicio.titulo}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {servicio.titulo}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {servicio.descripcion}
                  </p>
                  {servicio.precio && (
                    <div className="text-lg font-semibold text-green-400">
                      {servicio.precio.toLocaleString()} {servicio.moneda}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
