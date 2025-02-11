"use server";

import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 12;

export async function getServices(searchParams: string) {
  try {
    const params = new URLSearchParams(searchParams);
    const categoria = params.get("categoria");
    if (!categoria) throw new Error("Category is required");

    const precioMin = params.get("precioMin");
    const precioMax = params.get("precioMax");

    const where = {
      categoryId: {
        in: await prisma.category
          .findUnique({
            where: { slug: categoria },
            select: { id: true },
          })
          .then((cat) => (cat ? [cat.id] : [])),
      },
      ...(params.get("departamento") &&
        params.get("departamento") !== "todos" && {
          departamento: params.get("departamento"),
        }),
      ...(params.get("ciudad") &&
        params.get("ciudad") !== "todas" && {
          ciudad: params.get("ciudad"),
        }),
      ...(params.get("moneda") && {
        moneda: params.get("moneda"),
      }),
      ...((precioMin || precioMax) && {
        precio: {
          ...(precioMin && { gte: Number(precioMin) }),
          ...(precioMax && { lte: Number(precioMax) }),
        },
      }),
    };

    const page = Math.max(1, Number(params.get("page")) || 1);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: ITEMS_PER_PAGE,
        select: {
          id: true,
          titulo: true,
          descripcion: true,
          precio: true,
          moneda: true,
          departamento: true,
          ciudad: true,
          telefonoPrincipal: true,
          whatsapp: true,
          imagenes: true,
          email: true,
        },
      }),
      prisma.service.count({
        where,
      }),
    ]);

    return {
      services: services.map((service) => ({
        ...service,
        tieneImagenes: service.imagenes.length > 0,
        imagen: service.imagenes[0] || null,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
}
