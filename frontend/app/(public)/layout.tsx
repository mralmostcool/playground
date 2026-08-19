import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export const metadata = {
    title: "Maritime Portal",
    description: "Public access portal for maritime operations"
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-canvas text-body-text font-sans selection:bg-primary/20 selection:text-primary">
            <Breadcrumbs />
            <main className="flex-grow">
                {children}
            </main>
            {/* Dark Navy Footer */}
            <footer className="bg-surface-dark text-on-dark-soft py-16 px-6 md:px-12 border-t border-surface-dark-elevated">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-serif text-lg font-medium tracking-tight text-on-dark">Maritime Portal</span>
                            </div>
                            <p className="text-xs text-on-dark-soft max-w-[200px]">
                                Advanced maritime intelligence, seafarer credentials directory, and berth orchestration systems.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-on-dark font-serif text-sm font-medium">Portal</h4>
                            <Link href="/home" className="hover:text-on-dark text-xs transition-colors">Home Page</Link>
                            <Link href="/seafarer" className="hover:text-on-dark text-xs transition-colors">Seafarer Portal</Link>
                            <Link href="/dashboard" className="hover:text-on-dark text-xs transition-colors">Admin Console</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-on-dark font-serif text-sm font-medium">Modules</h4>
                            <Link href="/dashboard" className="hover:text-on-dark text-xs transition-colors">Vessel Control</Link>
                            <Link href="/dashboard" className="hover:text-on-dark text-xs transition-colors">Berth Allocation</Link>
                            <Link href="/dashboard" className="hover:text-on-dark text-xs transition-colors">Audit Registry</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-on-dark font-serif text-sm font-medium">Legal</h4>
                            <a href="#" className="hover:text-on-dark text-xs transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-on-dark text-xs transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-on-dark text-xs transition-colors">Security Audit</a>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-surface-dark-elevated flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <span>&copy; {new Date().getFullYear()}. All rights reserved.</span>
                        <span className="font-mono text-on-dark-soft/50">v0.1.0 (warm-editorial)</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}