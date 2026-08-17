// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Vessels", href: "/vessels" },
  { name: "Ranks", href: "/ranks" },
  { name: "Courses", href: "/pre-sea-courses" },
  { name: "Institutes", href: "/institutes" },
  { name: "Indos", href: "/indos" },
  { name: "Enrollments", href: "/enrollments" },
  { name: "Contracts", href: "/contracts" },
  { name: "Companies", href: "/companies" },
  { name: "Berths", href: "/berths" },
  { name: "Berth Allocations", href: "/berth-allocations" },
  { name: "Seafarer Allocations", href: "/berth-seafarer-allocations" },
  { name: "Audit Logs", href: "/audit-logs" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-4 px-2">Admin Panel</h2>
      <nav className="space-y-1">
        {sections.map((sec) => {
          const active = pathname === sec.href;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className={`block text-sm font-medium rounded px-3 py-2 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {sec.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
