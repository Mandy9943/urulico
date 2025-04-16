import ServiceGallery from "@/components/service-gallery";
import ServiceHeader from "@/components/service-header";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { NO_IMAGE } from "@/utils/const";
import { Info, Mail, MapPin, Phone, Tag, User } from "lucide-react";
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

// Agregar metadata export para SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { servicio } = await getServicio((await params).id);

  return {
    title: `${servicio.titulo} | Urulico`,
    description:
      servicio.descripcion?.slice(0, 160) ||
      `Servicio de ${servicio.titulo} en ${servicio.ciudad}, ${servicio.departamento}`,
    openGraph: {
      title: `${servicio.titulo} | Urulico`,
      description:
        servicio.descripcion?.slice(0, 160) ||
        `Servicio de ${servicio.titulo} en ${servicio.ciudad}, ${servicio.departamento}`,
      images: servicio.imagenes[0] ? [servicio.imagenes[0]] : undefined,
    },
    alternates: {
      canonical: `https://urulico.com/servicio/${servicio.id}`,
    },
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
  console.log(servicio);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Agregar schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: servicio.titulo,
            description: servicio.descripcion,
            provider: {
              "@type": "Organization",
              name: servicio.proveedor,
              email: servicio.email,
              telephone: servicio.telefonoPrincipal,
              areaServed: `${servicio.ciudad}, ${servicio.departamento}`,
            },
            ...(servicio.precio && {
              offers: {
                "@type": "Offer",
                price: servicio.precio,
                priceCurrency: servicio.moneda,
              },
            }),
          }),
        }}
      />

      <ServiceHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 lg:order-1">
            <ServiceGallery
              images={servicio.imagenes}
              title={servicio.titulo}
            />
          </div>

          {/* Service details */}
          <div className="space-y-6 lg:order-2">
            {/* Service title, location and price */}
            <div className="pb-4 border-b border-gray-800">
              <h1 className="text-3xl font-bold mb-3">{servicio.titulo}</h1>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span>
                  {servicio.ciudad && servicio.departamento
                    ? `${servicio.ciudad}, ${servicio.departamento}`
                    : servicio.ciudad || servicio.departamento || ""}
                </span>
              </div>
              {servicio.precio && (
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {servicio.precio.toLocaleString()} {servicio.moneda}
                  </span>
                </div>
              )}
            </div>

            {/* Description section */}
            <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Descripción</h2>
              </div>
              <p className="text-gray-300 whitespace-pre-line pl-7">
                {servicio.descripcion || "No hay descripción disponible."}
              </p>
            </div>

            {/* Provider section */}
            <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Nombre</h2>
              </div>
              <p className="text-lg pl-7">{servicio.proveedor}</p>
            </div>
          </div>

          {/* Contact section - moved to the bottom on mobile */}
          <div className="pt-6 order-3 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-800 pb-2">
              Contacto
            </h2>

            {/* Display contact info for copying */}
            <div className="space-y-4 mb-6 pl-2">
              {(servicio.contactoPor === "llamada-whatsapp" ||
                servicio.contactoPor === "todos" ||
                !servicio.contactoPor) &&
                servicio.telefonoPrincipal && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 select-all text-lg">
                      {servicio.telefonoPrincipal}
                    </span>
                  </div>
                )}
              {(servicio.contactoPor === "email" ||
                servicio.contactoPor === "todos" ||
                !servicio.contactoPor) &&
                servicio.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 select-all text-lg">
                      {servicio.email}
                    </span>
                  </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {(servicio.contactoPor === "llamada-whatsapp" ||
                servicio.contactoPor === "todos" ||
                !servicio.contactoPor) &&
                servicio.whatsapp &&
                servicio.telefonoPrincipal && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 shadow-md"
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
              {(servicio.contactoPor === "llamada-whatsapp" ||
                servicio.contactoPor === "todos" ||
                !servicio.contactoPor) &&
                servicio.telefonoPrincipal && (
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 shadow-md"
                    asChild
                  >
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
              {(servicio.contactoPor === "email" ||
                servicio.contactoPor === "todos" ||
                !servicio.contactoPor) &&
                servicio.email && (
                  <Button
                    variant="outline"
                    className={`w-full ${
                      servicio.contactoPor === "email" ? "sm:col-span-2" : ""
                    } border-gray-700 hover:bg-gray-800 shadow-md`}
                    asChild
                  >
                    <Link href={`mailto:${servicio.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar email
                    </Link>
                  </Button>
                )}
            </div>
          </div>
        </div>

        {/* Servicios relacionados - only show if there are related services */}
        {serviciosRelacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="h-1 w-6 bg-violet-500 rounded-full"></span>
              Servicios relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviciosRelacionados.map((servicio) => (
                <Link
                  key={servicio.id}
                  href={`/servicio/${servicio.id}`}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-all hover:shadow-md hover:shadow-violet-900/20 hover:-translate-y-1"
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
        )}
      </div>
    </main>
  );
}
