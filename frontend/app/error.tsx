"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Uncaught frontend error boundary trigger:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-canvas text-body-text font-sans p-6 text-center select-none">
      <div className="w-16 h-16 bg-error/15 rounded-full flex items-center justify-center text-error mb-6">
        <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif text-ink mb-3 tracking-tight">System Registry Exception</h1>
      <p className="text-xs md:text-sm text-muted max-w-md mb-8 leading-relaxed">
        An unexpected runtime error occurred while syncing with maritime databases.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="h-10 px-6 bg-primary text-on-primary font-semibold text-xs tracking-wide uppercase rounded-md hover:bg-primary-active inline-flex items-center justify-center transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = "/home"}
          className="h-10 px-5 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
