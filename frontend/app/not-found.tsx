"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-canvas text-body-text font-sans p-6 text-center select-none">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
        <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-ink mb-4 tracking-tight">404 — Registry Slot Missing</h1>
      <p className="text-xs md:text-sm text-muted max-w-md mb-8 leading-relaxed">
        The record identifier or registry path you queried does not exist or has been archived from database schemas.
      </p>
      <Link
        href="/home"
        className="h-10 px-6 bg-primary text-on-primary font-semibold text-xs tracking-wide uppercase rounded-md hover:bg-primary-active inline-flex items-center justify-center transition-colors cursor-pointer"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
