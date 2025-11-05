"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProducts() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      role="status"
      aria-live="polite"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-square" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
