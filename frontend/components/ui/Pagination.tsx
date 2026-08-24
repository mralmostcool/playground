import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-hairline pt-4 mt-6 text-xs text-muted">
      <div>
        {totalElements !== undefined && (
          <span>Total records: <strong className="text-ink">{totalElements}</strong></span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>
          Page <strong className="text-ink">{page + 1}</strong> of <strong className="text-ink">{totalPages}</strong>
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-3 bg-surface-card hover:bg-surface-soft border border-hairline rounded-md text-ink disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-3 bg-surface-card hover:bg-surface-soft border border-hairline rounded-md text-ink disabled:opacity-40 disabled:hover:bg-surface-card disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
