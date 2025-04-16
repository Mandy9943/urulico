import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming shadcn/ui Skeleton is used
import React from "react";

const RecentServicesGridSkeleton: React.FC = () => {
  return (
    <section className="py-12 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mx-auto mb-8" /> {/* Title Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map(
            (
              _,
              index // Render 6 placeholder cards
            ) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 text-white h-full flex flex-col"
              >
                <CardHeader className="p-0 relative h-48 overflow-hidden">
                  <Skeleton className="h-full w-full rounded-t-lg" />{" "}
                  {/* Image Skeleton */}
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  <Skeleton className="h-5 w-3/4 mb-2" /> {/* Title Skeleton */}
                  <Skeleton className="h-4 w-full mb-2" />{" "}
                  {/* Description Line 1 */}
                  <Skeleton className="h-4 w-5/6 mb-3" />{" "}
                  {/* Description Line 2 */}
                  <Skeleton className="h-6 w-24" /> {/* Badge Skeleton */}
                </CardContent>
                <CardFooter className="pt-2 pb-4 px-4 justify-between items-center">
                  <Skeleton className="h-6 w-20" /> {/* Price Skeleton */}
                  <Skeleton className="h-4 w-16" /> {/* Date Skeleton */}
                </CardFooter>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentServicesGridSkeleton;
