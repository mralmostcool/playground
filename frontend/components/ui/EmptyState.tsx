import React from "react";

interface EmptyStateProps {
  title?: string;
  message: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function EmptyState({ title = "No records found", message, ctaLabel, onCtaClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-card border border-hairline rounded-lg mt-4">
      <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center text-muted mb-4">
        <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      <p className="text-xs text-muted max-w-sm mb-6 leading-relaxed">{message}</p>
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="h-9 px-4 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
