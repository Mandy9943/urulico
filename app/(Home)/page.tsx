import prisma from "@/lib/prisma";
import {
  BookOpen,
  ChefHat,
  Computer,
  Hammer,
  Heart,
  Home,
  LucideIcon,
  LucideProps,
  Palette,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesGrid from "./components/CategoriesGrid";
import CTASection from "./components/CTASection";
import SearchBar from "./components/SearchBar";

// Metadatos para SEO
export const metadata = {
  title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
  description:
    "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
  keywords: [
    "Uruguay",
    "anuncios",
    "servicios",
    "publicidad",
    "plataforma digital",
  ],

  // Configuración de íconos
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/logo-196.png",
    apple: [{ url: "/logo-180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "apple-touch-icon-precomposed", url: "/logo-180.png" }],
  },

  // Configuración de manifest para PWA
  manifest: "/manifest.json",

  // Open Graph mejorado con imágenes
  openGraph: {
    title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
    description:
      "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
    url: "https://urulico.com/",
    siteName: "Urulico",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "Logo de Urulico",
      },
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Vista previa de Urulico",
      },
    ],
  },

  // Twitter Cards mejorado
  twitter: {
    card: "summary_large_image",
    title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
    description:
      "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
    images: ["/preview.png"],
    creator: "@urulico",
  },

  // URL canónica
  alternates: {
    canonical: "https://urulico.com/",
  },

  // Configuración de la aplicación web
  applicationName: "Urulico",
  appleWebApp: {
    capable: true,
    title: "Urulico",
    statusBarStyle: "default",
    startupImage: ["/logo-512.png"],
  },
};

// Icon mapping object
const iconMap: { [key: string]: LucideIcon } = {
  Wrench,
  Hammer,
  Home,
  Heart,
  Palette,
  Computer,
  Shield,
  BookOpen,
  Truck,
  ChefHat,
};

// Add these interfaces
interface DatabaseCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformedCategory extends Omit<DatabaseCategory, "icon"> {
  icon: React.FunctionComponentElement<LucideProps> | null;
}

// Update the return type of getCategories
async function getCategories(): Promise<TransformedCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    ...category,
    icon: iconMap[category.icon]
      ? React.createElement(
          iconMap[
            category.icon.charAt(0).toUpperCase() + category.icon.slice(1)
          ],
          {
            className: `w-6 h-6 text-${category.icon.toLowerCase()}-400`,
          }
        )
      : null,
  }));
}

export default async function LandingPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="font-syne text-4xl flex justify-center items-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-emerald-400 tracking-tight">
              <Image src="/logo.png" alt="Urulico" width={205} height={154} />
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Tu plataforma de anuncios y servicios en Uruguay. Publica y
              encuentra servicios de manera rápida y sencilla.
            </p>
            <SearchBar categories={categories} />
          </div>
        </div>
      </div>

      <CategoriesGrid categories={categories} />
      <CTASection />
    </main>
  );
}
