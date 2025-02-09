import Link from "next/link";
import type { TransformedCategory } from "../page";

export default function CategoriesGrid({
  categories,
}: {
  categories: TransformedCategory[];
}) {
  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              href={`/categoria?categoria=${category.slug}`}
              key={category.slug}
              className="group p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-violet-500 transition-all"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-sm font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
