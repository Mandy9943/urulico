import ServiceFilters from "@/components/ServiceFilters";
import { Home } from "lucide-react";
import Link from "next/link";

interface Props {
  categoria: string;
}

export default function CategoryHeader({ categoria }: Props) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">
              Servicios en{" "}
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </h1>
          </div>

          <div className="w-full">
            <ServiceFilters />
          </div>
        </div>
      </div>
    </div>
  );
}
