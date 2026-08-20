"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getInstitute, getCourse } from "@/lib/apiClient";

// Map URL segments to human-readable titles
const pathTitleMap: Record<string, string> = {
  home: "Home",
  seafarer: "Seafarer Portal",
  courses: "Courses Hub",
};

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export default function Breadcrumbs() {
  const pathname = usePathname() || "";
  const [resolvedTitles, setResolvedTitles] = useState<Record<string, string>>({});
  
  // Split the pathname and filter out empty segments
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    segments.forEach(async (segment) => {
      if (uuidRegex.test(segment) && !resolvedTitles[segment]) {
        try {
          const inst = await getInstitute(segment);
          if (inst && inst.name) {
            setResolvedTitles((prev) => ({ ...prev, [segment]: inst.name }));
          }
        } catch (err) {
          try {
            const course = await getCourse(segment);
            if (course && course.name) {
              setResolvedTitles((prev) => ({ ...prev, [segment]: course.name }));
            }
          } catch (err2) {
            console.error("Failed to resolve breadcrumb for segment", segment, err2);
          }
        }
      }
    });
  }, [pathname]);

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
      title: resolvedTitles[segment] || pathTitleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
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
