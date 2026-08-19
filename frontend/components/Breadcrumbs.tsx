"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Map URL segments to human-readable titles
const pathTitleMap: Record<string, string> = {
  home: "Home",
  seafarer: "Seafarer Portal",
};

export default function Breadcrumbs() {
  const pathname = usePathname() || "";
  
  // Split the pathname and filter out empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Initialize breadcrumb chain with the root Portal Gateway '/'
  const items = [
    {
      title: "Gateway",
      href: "/",
    },
  ];

  let accumulatedPath = "";
  segments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    items.push({
      title: pathTitleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: accumulatedPath,
    });
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="h-12 bg-canvas border-b border-hairline flex items-center justify-center px-6 md:px-12 sticky top-0 z-50 text-xs font-mono text-muted flex-shrink-0"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="text-muted-soft select-none font-sans" aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-ink font-semibold select-none" aria-current="page">
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors duration-150 font-medium"
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
