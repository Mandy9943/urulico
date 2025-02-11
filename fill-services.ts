import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Reduce batch size to avoid rate limits
const BATCH_SIZE = 10; // Reduced from 50 to 10

interface ServiceData {
  nombre: string;
  servicio: string;
  descripcion?: string;
  telefono?: string;
  email?: string;
  whatsapp?: string;
  ubicacion?: string;
  imagen?: string;
}

interface CategorizedService {
  categorySlug: string;
  confidence: number;
  reasoning: string;
}

async function categorizarServicio(
  service: ServiceData
): Promise<CategorizedService> {
  const prompt = `You are a Service Categorization AI. Analyze this service and categorize it into one of these categories:
  - instalacion-mantenimiento (Installation & Maintenance)
  - construccion-carpinteria (Construction & Carpentry)
  - servicios-domesticos (Domestic Services)
  - salud-belleza (Health & Beauty)
  - artes-entretenimiento (Arts & Entertainment)
  - tecnologia-informatica (Technology & IT)
  - servicios-profesionales (Professional Services)
  - educacion-tutorias (Education & Tutoring)
  - transporte-mudanzas (Transport & Moving)
  - gastronomia-catering (Gastronomy & Catering)

Service to analyze:
Name: ${service.nombre}
Service Type: ${service.servicio}
Description: ${service.descripcion || "N/A"}
Location/Area: ${service.ubicacion || "N/A"}

Output in JSON format with keys:
- categorySlug: the most appropriate category slug from the list
- confidence: number between 0-1 indicating confidence in categorization
- reasoning: brief explanation of why this category was chosen

Ensure the response is only valid JSON.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const jsonResponse = JSON.parse(
    //@ts-ignore
    response.content[0].text
  ) as CategorizedService;
  return jsonResponse;
}

async function processServicesBatch(
  services: ServiceData[],
  categoriasMap: Record<string, string>
) {
  // Add delay between each service to respect rate limits
  const results = [];
  for (const service of services) {
    try {
      // Add 1.5 second delay between each service
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const categorization = await categorizarServicio(service);

      if (categorization.confidence < 0.6) {
        console.log(
          `Low confidence categorization for service: ${service.nombre}`
        );
        results.push(null);
        continue;
      }
      console.log("categorization", categorization);
      const categoryId = categoriasMap[categorization.categorySlug];
      if (!categoryId) {
        console.log(`Invalid category for service: ${service.nombre}`);
        results.push(null);
        continue;
      }

      const serviceData = {
        titulo: service.nombre,
        descripcion: service.descripcion || "",
        proveedor: service.nombre,
        telefonoPrincipal: service.telefono,
        whatsapp: !!service.whatsapp,
        email: service.email || "",
        imagenes: service.imagen ? [service.imagen] : [],
        // Default values for required fields
        precio: null,
        moneda: null,
        departamento: null,
        ciudad: null,
        contactoPor: "email",
      };

      const result = await prisma.service.create({
        data: {
          ...serviceData,
          category: {
            connect: {
              id: categoryId,
            },
          },
          user: {
            connectOrCreate: {
              where: {
                email: service.email || "test@example.com",
              },
              create: {
                email: service.email || "test@example.com",
              },
            },
          },
        },
      });
      results.push(result);
    } catch (error) {
      console.error(`Error processing service: ${service.nombre}`, error);
      results.push(null);
    }
  }
  return results;
}

async function main() {
  try {
    // Read JSON file
    const jsonData = await fs.readFile("profesionales2.json", "utf8");
    const allServices = JSON.parse(jsonData) as ServiceData[];

    // Filter out duplicates based on email
    const emailMap = new Map<string, ServiceData>();
    const services = allServices.filter((service) => {
      if (!service.email) return true; // Keep services without email

      if (emailMap.has(service.email.toLowerCase())) {
        console.log(
          `Duplicate email found: ${service.email} for service: ${service.nombre}`
        );
        return false;
      }

      emailMap.set(service.email.toLowerCase(), service);
      return true;
    });

    console.log(
      `Filtered ${allServices.length - services.length} duplicate services`
    );

    // Get categories mapping
    const categories = await prisma.category.findMany();
    const categoriasMap = categories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Process services in batches
    const batches = [];
    for (let i = 0; i < services.length; i += BATCH_SIZE) {
      const batch = services.slice(i, i + BATCH_SIZE);
      batches.push(batch);
    }

    console.log(
      `Processing ${services.length} services in ${batches.length} batches`
    );

    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length}`);
      const results = await processServicesBatch(batches[i], categoriasMap);
      const successCount = results.filter((r) => r !== null).length;
      console.log(
        `Batch ${i + 1} completed: ${successCount}/${
          batches[i].length
        } services processed successfully`
      );
    }

    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Error during data import:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
