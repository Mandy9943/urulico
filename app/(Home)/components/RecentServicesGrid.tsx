import { Badge } from "@/components/ui/badge"; // Assuming shadcn/ui Badge is used
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming shadcn/ui Card is used
import { Category, Service } from "@prisma/client"; // Import Prisma types
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Extend Service type to include the Category relation
interface ServiceWithCategory extends Service {
  category: Category;
}

interface RecentServicesGridProps {
  services: ServiceWithCategory[];
}

const RecentServicesGrid: React.FC<RecentServicesGridProps> = ({
  services,
}) => {
  if (!services || services.length === 0) {
    return null; // Don't render anything if there are no services
  }

  return (
    <section className="py-12 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-syne font-bold text-center mb-8 text-white">
          Servicios Recientes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              href={`/servicio/${service.id}`}
              key={service.id}
              className="block hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <Card className="bg-gray-800 border-gray-700 text-white h-full flex flex-col">
                <CardHeader className="p-0 relative h-48 overflow-hidden">
                  {service.imagenes && service.imagenes.length > 0 ? (
                    <Image
                      src={service.imagenes[0]} // Display the first image
                      alt={service.titulo}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  ) : (
                    <div className="bg-gray-700 h-full flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">Sin Imagen</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  <CardTitle className="text-lg font-semibold mb-2 truncate">
                    {service.titulo}
                  </CardTitle>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {service.descripcion || "Sin descripción"}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-violet-600/30 text-violet-300 border-violet-500"
                  >
                    {service.category.name}
                  </Badge>
                </CardContent>
                <CardFooter className="pt-2 pb-4 px-4 justify-between items-center">
                  <span className="text-lg font-bold text-emerald-400">
                    {service.precio
                      ? `${
                          service.moneda || "$"
                        } ${service.precio.toLocaleString()}`
                      : "Consultar"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentServicesGrid;
