// components/Sidebar.tsx
import Link from 'next/link';

const sections = [
  { name: 'Dashboard', href: '/internal' },
  { name: 'Vessels', href: '/internal/vessels' },
  { name: 'Ranks', href: '/internal/ranks' },
  { name: 'Courses', href: '/internal/pre-sea-courses' },
  { name: 'Institutes', href: '/internal/institutes' },
  { name: 'Indos', href: '/internal/indos' },
  { name: 'Enrollments', href: '/internal/enrollments' },
  { name: 'Contracts', href: '/internal/contracts' },
  { name: 'Companies', href: '/internal/companies' },
  { name: 'Berths', href: '/internal/berths' },
  { name: 'Allocations', href: '/internal/berth-allocations' },
  { name: 'Audit Logs', href: '/internal/audit-logs' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {sections.map((sec) => (
          <Link key={sec.href} href={sec.href} className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-2">
            {sec.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
