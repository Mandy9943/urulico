import ServiceGallery from "@/components/service-gallery";
import ServiceHeader from "@/components/service-header";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { NO_IMAGE } from "@/utils/const";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Función para obtener todos los IDs de servicios desde la base de datos
async function getServiciosIds() {
  const servicios = await prisma.service.findMany({
    select: {
      id: true,
    },
  });
  return servicios;
}

// Función requerida para generar las rutas estáticas
export async function generateStaticParams() {
  const servicios = await getServiciosIds();
  return servicios.map((servicio) => ({
    id: servicio.id,
  }));
}

// Función para obtener un servicio específico y servicios relacionados
async function getServicio(id: string) {
  const servicio = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!servicio) {
    throw new Error("Servicio no encontrado");
  }

  // Obtener servicios relacionados de la misma categoría
  const serviciosRelacionados = await prisma.service.findMany({
    where: {
      categoryId: servicio.categoryId,
      NOT: {
        id: servicio.id,
      },
    },
    take: 4,
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      precio: true,
      moneda: true,
      imagenes: true,
    },
  });

  return {
    servicio,
    serviciosRelacionados: serviciosRelacionados.map((s) => ({
      ...s,
      tieneImagenes: s.imagenes.length > 0,
      imagen: s.imagenes[0] || null,
    })),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { servicio, serviciosRelacionados } = await getServicio(
    (
      await params
    ).id
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <ServiceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ServiceGallery images={servicio.imagenes} title={servicio.titulo} />

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
                <div className="aspect-square relative">
                  <Image
                    src={servicio.imagen || NO_IMAGE}
                    alt={servicio.titulo}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
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
