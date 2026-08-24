import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, backHref, backLabel, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:justify-between border-b border-hairline pb-4 mb-6">
      <div className="flex flex-col gap-1">
        {backHref && (
          <Link href={backHref} className="text-xs text-primary hover:underline font-mono mb-1 inline-flex items-center gap-1">
            &larr; {backLabel || "Back"}
          </Link>
        )}
        <h1 className="text-3xl font-serif text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted leading-relaxed">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 mt-4 md:mt-0 flex-shrink-0">{children}</div>}
    </div>
  );
}
