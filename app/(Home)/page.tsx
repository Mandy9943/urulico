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
import React, { Suspense } from "react";
import CategoriesGrid from "./components/CategoriesGrid";
import CategoriesGridSkeleton from "./components/CategoriesGridSkeleton";
import CTASection from "./components/CTASection";
import RecentServicesGrid from "./components/RecentServicesGrid";
import RecentServicesGridSkeleton from "./components/RecentServicesGridSkeleton";
import SearchBar from "./components/SearchBar";
import SearchBarSkeleton from "./components/SearchBarSkeleton";

// Metadatos para SEO
export const metadata = {
  alternates: {
    canonical: "https://urulico.com/",
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

// Add function to fetch recent services
async function getRecentServices() {
  const services = await prisma.service.findMany({
    take: 6, // Fetch the latest 6 services
    orderBy: {
      createdAt: "desc", // Order by creation date, newest first
    },
    include: {
      category: true, // Include category information
      // Add other necessary relations if needed, e.g., user, images
    },
  });
  return services;
}

export default async function LandingPage() {
  // Note: Data fetching remains here for Server Components
  const categoriesPromise = getCategories();
  const recentServicesPromise = getRecentServices();

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
            <Suspense fallback={<SearchBarSkeleton />}>
              <SearchBar categories={await categoriesPromise} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Categories Section with Suspense */}
      <Suspense fallback={<CategoriesGridSkeleton />}>
        <CategoriesGrid categories={await categoriesPromise} />
      </Suspense>

      {/* Recent Services Section with Suspense */}
      <Suspense fallback={<RecentServicesGridSkeleton />}>
        <RecentServicesGrid services={await recentServicesPromise} />
      </Suspense>

      {/* CTA Section - Assuming it doesn't need data or is static */}
      <CTASection />
    </main>
  );
}
