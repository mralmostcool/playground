"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavBarLinks = {
    title: string;
    href: string;
}

const group: NavBarLinks[] = [
    { title: 'Home', href: '/home' },
    { title: 'Seafarer Portal', href: '/seafarer' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="h-16 bg-canvas border-b border-hairline flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
            <Link href="/home" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
                {/* Radial Spike Brand Mark */}
                <svg className="w-5 h-5 text-primary fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                </svg>
                <span className="font-serif text-lg font-medium tracking-tight text-ink">Aegir Maritime</span>
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium">
                {group.map((sec) => {
                    const active = pathname === sec.href;
                    return (
                        <Link 
                            key={sec.href}
                            href={sec.href} 
                            className={`transition-all duration-150 relative py-1 text-sm ${
                                active 
                                    ? "text-primary font-semibold" 
                                    : "text-muted hover:text-ink"
                            }`}
                        >
                            {sec.title}
                            {active && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div>
                <Link href="/dashboard" className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors shadow-none">
                    Console
                </Link>
            </div>
        </header>
    );
}

