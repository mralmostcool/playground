// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Table CRUD items (excluding the dashboard)
const crudItems = [
  { name: "Ranks", href: "/ranks" },
  { name: "Institutes", href: "/institutes" },
  { name: "Indos", href: "/indos" },
  { name: "Enrollments", href: "/enrollments" },
  { name: "Courses", href: "/pre-sea-courses" },
  { name: "Companies", href: "/companies" },
  { name: "Vessels", href: "/vessels" },
  { name: "Berths", href: "/berths" },
  { name: "Berth Allocations", href: "/berth-allocations" },
  { name: "Seafarer Allocations", href: "/berth-seafarer-allocations" },
  { name: "Contracts", href: "/contracts" },
  { name: "Audit Logs", href: "/audit-logs" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-surface-dark text-on-dark-soft py-4 px-3 overflow-hidden border-r border-surface-dark-elevated flex flex-col justify-between flex-shrink-0">
      <div className="flex flex-col overflow-hidden flex-1">
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 mb-4 px-3 flex-shrink-0">
          <span className="font-serif text-lg font-semibold tracking-tight text-on-dark">Admin Console</span>
        </div>

        {/* Dashboard Section (Separated from CRUD list) */}
        <div className="px-1 flex-shrink-0">
          <Link
            href="/dashboard"
            className={`block text-xs font-semibold rounded-md px-3 py-2 transition duration-150 ${
              pathname === "/dashboard"
                ? "bg-primary text-on-primary"
                : "text-on-dark-soft hover:text-on-dark hover:bg-surface-dark-elevated"
            }`}
          >
            Dashboard Overview
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-dark-elevated my-3 mx-1 flex-shrink-0" />
        
        {/* Scrollable CRUD Entities List */}
        <nav className="space-y-0.5 overflow-y-auto pr-1 flex-1">
          {crudItems.map((sec) => {
            const active = pathname === sec.href;
            return (
              <Link
                key={sec.href}
                href={sec.href}
                className={`block text-xs font-medium rounded-md px-3 py-1.5 transition duration-150 ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-dark-soft hover:text-on-dark hover:bg-surface-dark-elevated"
                }`}
              >
                {sec.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      <div className="pt-3 border-t border-surface-dark-elevated px-3 flex flex-col gap-2.5 flex-shrink-0 mt-4">
        <Link 
          href="/" 
          className="w-full h-8 bg-surface-dark-elevated hover:bg-primary hover:text-on-primary text-on-dark-soft font-medium rounded-md inline-flex items-center justify-center gap-1.5 text-xs transition-colors"
        >
          <svg className="w-3 h-3 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Exit to Gateway
        </Link>
        <p className="text-[9px] text-on-dark-soft/40 font-mono">Admin System v0.1.0</p>
      </div>
    </aside>
  );
}
