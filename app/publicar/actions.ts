"use server";

import { searchClient } from "@/lib/algolia";
import prisma from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  categoria: z.string({
    required_error: "Por favor selecciona una categoría",
  }),
  titulo: z
    .string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  descripcion: z.string().optional(),
  precio: z.number().optional(),
  moneda: z.string().optional(),
  departamento: z.string().optional(),
  ciudad: z.string().optional(),
  proveedor: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  telefonoPrincipal: z.string().optional(),
  telefonoSecundario: z.string().optional(),
  whatsapp: z.boolean().default(false),
  email: z.string().email("Por favor ingresa un email válido"),
  contactoPor: z.enum(["email", "llamada-whatsapp", "todos"]).optional(),
});

export async function createService(
  formData: z.infer<typeof formSchema>,
  imageUrls: string[]
) {
  try {
    const validatedFields = formSchema.parse(formData);

    // Set contactoPor to "email" if no phone numbers are provided
    const contactoPor = !validatedFields.telefonoPrincipal
      ? "email"
      : validatedFields.contactoPor || "email";

    // Destructure categoria and create a data object without it
    const { categoria, ...serviceData } = validatedFields;

    // For now, we'll use a hardcoded userId since we don't have auth yet

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        contactoPor,
        imagenes: imageUrls,
        user: {
          connectOrCreate: {
            where: {
              email: validatedFields.email,
            },
            create: {
              email: validatedFields.email,
            },
          },
        },
        category: {
          connect: {
            slug: categoria,
          },
        },
      },
      include: {
        category: true,
        user: true,
      },
    });

    // Index the new service in Algolia
    await searchClient.saveObject({
      indexName: "services_index",
      body: service,
    });

    return { success: true, data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Failed to create service" };
  }
}
