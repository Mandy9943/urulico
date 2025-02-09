import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categorias = [
  {
    name: "Instalación y Mantenimiento",
    slug: "instalacion-mantenimiento",
    icon: "Wrench",
  },
  {
    name: "Construcción y Carpintería",
    slug: "construccion-carpinteria",
    icon: "Hammer",
  },
  {
    name: "Servicios Domésticos",
    slug: "servicios-domesticos",
    icon: "Home",
  },
  {
    name: "Salud y Belleza",
    slug: "salud-belleza",
    icon: "Heart",
  },
  {
    name: "Artes y Entretenimiento",
    slug: "artes-entretenimiento",
    icon: "Palette",
  },
  {
    name: "Tecnología e Informática",
    slug: "tecnologia-informatica",
    icon: "Computer",
  },
  {
    name: "Servicios Profesionales",
    slug: "servicios-profesionales",
    icon: "Shield",
  },
  {
    name: "Educación y Tutorías",
    slug: "educacion-tutorias",
    icon: "BookOpen",
  },
  {
    name: "Transporte y Mudanzas",
    slug: "transporte-mudanzas",
    icon: "Truck",
  },
  {
    name: "Gastronomía y Catering",
    slug: "gastronomia-catering",
    icon: "ChefHat",
  },
];

const departamentos = [
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Colonia",
  "San José",
  "Paysandú",
  "Salto",
  "Rivera",
];

const ciudades = {
  Montevideo: ["Centro", "Pocitos", "Cordón", "Punta Carretas", "Malvín"],
  Canelones: ["Las Piedras", "Ciudad de la Costa", "Pando", "La Paz"],
  Maldonado: ["Punta del Este", "Maldonado", "San Carlos"],
  Colonia: ["Colonia del Sacramento", "Carmelo", "Nueva Helvecia"],
  "San José": ["San José de Mayo", "Ciudad del Plata", "Libertad"],
  Paysandú: ["Paysandú", "Guichón", "Quebracho"],
  Salto: ["Salto", "Daymán", "Constitución"],
  Rivera: ["Rivera", "Tranqueras", "Vichadero"],
};

const serviciosEjemplo = [
  {
    titulo: "Instalación de Aires Acondicionados",
    descripcion:
      "Instalación profesional de aires acondicionados split. Experiencia de más de 10 años en el rubro.",
    precio: 2500,
    moneda: "UYU",
    categoria: "instalacion-mantenimiento",
  },
  {
    titulo: "Clases de Guitarra",
    descripcion:
      "Clases personalizadas de guitarra para todos los niveles. Método práctico y dinámico.",
    precio: 800,
    moneda: "UYU",
    categoria: "artes-entretenimiento",
  },
  {
    titulo: "Desarrollo de Sitios Web",
    descripcion:
      "Diseño y desarrollo de sitios web profesionales. Responsive y optimizados para SEO.",
    precio: 150,
    moneda: "USD",
    categoria: "tecnologia-informatica",
  },
  // ... más servicios base para copiar y variar
];

const imagenes = [
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a",
  "https://images.unsplash.com/photo-1585338107529-13afc5f02586",
  "https://images.unsplash.com/photo-1594322436404-5a0526db4d13",
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5",
];

async function main() {
  // Crear usuario de prueba
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
    },
  });

  // Crear categorías
  const categoriasCreadas = await Promise.all(
    categorias.map((cat) =>
      prisma.category.create({
        data: cat,
      })
    )
  );

  // Mapeo de categorías para fácil acceso
  const categoriasMap = categoriasCreadas.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Crear 30 servicios
  for (let i = 0; i < 30; i++) {
    // Seleccionar una categoría aleatoria
    const categoriaSlug =
      categorias[Math.floor(Math.random() * categorias.length)].slug;
    const departamento =
      departamentos[Math.floor(Math.random() * departamentos.length)];
    const ciudadesDisponibles = ciudades[departamento as keyof typeof ciudades];
    const ciudad =
      ciudadesDisponibles[
        Math.floor(Math.random() * ciudadesDisponibles.length)
      ];

    // Crear servicio
    await prisma.service.create({
      data: {
        userId: user.id,
        categoryId: categoriasMap[categoriaSlug],
        titulo: `Servicio de ${
          categorias.find((c) => c.slug === categoriaSlug)?.name
        } ${i + 1}`,
        descripcion: `Descripción detallada del servicio ${
          i + 1
        }. Ofrecemos atención personalizada y garantía en nuestro trabajo.`,
        precio: Math.floor(Math.random() * 5000) + 500,
        moneda: Math.random() > 0.2 ? "UYU" : "USD",
        departamento,
        ciudad,
        proveedor: `Proveedor ${i + 1}`,
        telefonoPrincipal: `098${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")}`,
        whatsapp: Math.random() > 0.3,
        email: `proveedor${i + 1}@example.com`,
        imagenes: Math.random() > 0.3 ? [imagenes[i % imagenes.length]] : [],
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
