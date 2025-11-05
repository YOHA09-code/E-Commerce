"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProductDetail() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      role="status"
      aria-live="polite"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="w-full aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
