import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Home",
  description: "Public access portal for maritime operations",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-canvas text-body-text font-sans flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      <Breadcrumbs />
      <main className="flex-1 overflow-hidden flex flex-col justify-center">
        {children}
      </main>
      {/* Minimal Footer */}
      <footer className="py-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between px-8 text-xs text-muted font-mono bg-surface-soft w-full flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="font-serif text-sm font-medium text-ink">Portal Home</span>
        </div>
        <div>
          <span>&copy; 2026. Platform: Spring Boot & Next.js.</span>
        </div>
      </footer>
    </div>
  );
}
