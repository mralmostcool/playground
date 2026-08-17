// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard" }
    ]
  },
  {
    title: "Reference Data",
    items: [
      { name: "Ranks", href: "/ranks" },
      { name: "Institutes", href: "/institutes" }
    ]
  },
  {
    title: "Seafarer",
    items: [
      { name: "Indos", href: "/indos" },
      { name: "Enrollments", href: "/enrollments" }
    ]
  },
  {
    title: "Course",
    items: [
      { name: "Courses", href: "/pre-sea-courses" }
    ]
  },
  {
    title: "Shipping",
    items: [
      { name: "Companies", href: "/companies" },
      { name: "Vessels", href: "/vessels" },
      { name: "Berths", href: "/berths" },
      { name: "Berth Allocations", href: "/berth-allocations" }
    ]
  },
  {
    title: "Training",
    items: [
      { name: "Seafarer Allocations", href: "/berth-seafarer-allocations" },
      { name: "Contracts", href: "/contracts" }
    ]
  },
  {
    title: "System",
    items: [
      { name: "Audit Logs", href: "/audit-logs" }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-surface-dark text-on-dark-soft p-5 overflow-y-auto border-r border-surface-dark-elevated flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          {/* Radial Spike Mark (SVG icon) */}
          <svg className="w-5 h-5 text-primary fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
          </svg>
          <span className="font-serif text-xl font-medium tracking-tight text-on-dark">Aegir Maritime</span>
        </div>
        <nav className="space-y-5">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h4 className="text-[10px] font-semibold tracking-wider text-on-dark-soft/40 px-3 uppercase">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((sec) => {
                  const active = pathname === sec.href;
                  return (
                    <Link
                      key={sec.href}
                      href={sec.href}
                      className={`block text-sm font-medium rounded-md px-3 py-2 transition duration-150 ${
                        active
                          ? "bg-primary text-on-primary"
                          : "text-on-dark-soft hover:text-on-dark hover:bg-surface-dark-elevated"
                      }`}
                    >
                      {sec.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="pt-4 border-t border-surface-dark-elevated px-2 mt-6">
        <p className="text-xs text-on-dark-soft font-mono">Aegir Admin System v0.1.0</p>
      </div>
    </aside>
  );
}
