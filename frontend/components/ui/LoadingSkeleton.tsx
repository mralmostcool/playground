import React from "react";

interface LoadingSkeletonProps {
  rows?: number;
  type?: "table" | "card" | "list";
}

export default function LoadingSkeleton({ rows = 3, type = "table" }: LoadingSkeletonProps) {
  const rowArr = Array.from({ length: rows });

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {rowArr.map((_, i) => (
          <div key={i} className="p-6 bg-surface-card border border-hairline rounded-xl flex flex-col gap-4">
            <div className="w-10 h-10 bg-hairline rounded-lg" />
            <div className="h-5 bg-hairline rounded w-3/4" />
            <div className="h-4 bg-hairline rounded w-5/6" />
            <div className="h-3 bg-hairline rounded w-1/2 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {rowArr.map((_, i) => (
          <div key={i} className="p-4 bg-surface-card border border-hairline rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-2 w-2/3">
              <div className="h-4 bg-hairline rounded w-1/3" />
              <div className="h-3 bg-hairline rounded w-1/2" />
            </div>
            <div className="w-16 h-6 bg-hairline rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-card border border-hairline rounded-lg p-6 animate-pulse flex flex-col gap-4">
      <div className="h-6 bg-hairline rounded w-1/4 mb-4" />
      {rowArr.map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-8 bg-hairline rounded flex-1" />
          <div className="h-8 bg-hairline rounded flex-1" />
          <div className="h-8 bg-hairline rounded flex-1" />
          <div className="h-8 bg-hairline rounded flex-1" />
        </div>
      ))}
    </div>
  );
}
