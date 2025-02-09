import ServiceClient from "@/components/service-client";
import prisma from "@/lib/prisma";

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
  params: { id: string };
}) {
  const { servicio, serviciosRelacionados } = await getServicio(
    (
      await params
    ).id
  );
  return (
    <ServiceClient
      servicio={servicio}
      serviciosRelacionados={serviciosRelacionados}
    />
  );
}
