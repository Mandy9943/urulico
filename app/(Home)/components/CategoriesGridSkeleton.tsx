import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CategoriesGridSkeleton: React.FC = () => {
  // Determine a reasonable number of skeletons to show, e.g., 10
  const skeletonCount = 10;

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40 mb-8" /> {/* Title Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(skeletonCount)].map((_, index) => (
            <div
              key={index}
              className="group p-4 bg-gray-900/50 rounded-lg border border-gray-800"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Skeleton className="w-12 h-12 rounded-full" />{" "}
                {/* Icon Skeleton */}
                <Skeleton className="h-4 w-20" /> {/* Name Skeleton */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGridSkeleton;
