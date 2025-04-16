import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SearchBarSkeleton: React.FC = () => {
  return (
    <div className="mt-8 max-w-2xl mx-auto relative">
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
};

export default SearchBarSkeleton;
