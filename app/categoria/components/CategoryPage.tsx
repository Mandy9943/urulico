import ServiceHeader from "@/components/service-header";
import { Suspense } from "react";
import CategoryHeader from "./CategoryHeader";
import ServicesList from "./ServicesList";

interface Props {
  categoria: string;
  searchParams: Promise<Record<string, string>>;
}

export default function CategoryPage({ categoria, searchParams }: Props) {
  return (
    <main className="min-h-screen bg-black text-white">
      <ServiceHeader />
      <CategoryHeader categoria={categoria} />

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
              <div className="animate-pulse h-72 bg-gray-800 rounded-md"></div>
            </div>
          </div>
        }
      >
        <ServicesList categoria={categoria} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
