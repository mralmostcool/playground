import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-body-text font-sans flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="h-16 bg-canvas border-b border-hairline flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Radial Spike Brand Mark */}
          <svg className="w-5 h-5 text-primary fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
          </svg>
          <span className="font-serif text-lg font-medium tracking-tight text-ink">Aegir Maritime</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#system" className="hover:text-ink transition-colors">System Overview</a>
          <a href="#modules" className="hover:text-ink transition-colors">Key Modules</a>
          <a href="#terminal" className="hover:text-ink transition-colors">API Console</a>
          <Link href="/dashboard" className="hover:text-ink transition-colors">Admin Panel</Link>
        </nav>
        <div>
          <Link href="/dashboard" className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors shadow-none">
            Launch Console
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div>
            <span className="inline-flex items-center bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              AEGIR MARINE SUITE v0.1
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink leading-tight tracking-tight">
            The warm editorial portal for seafarer & berth management.
          </h1>
          <p className="text-lg leading-relaxed text-body-text max-w-xl">
            A resilient, secure administrative suite engineered with Spring Boot 3.4 and Next.js. Intuitively orchestrate seafarer courses, manage vessel compliance, allocate berths, and review audit records from a warm, humanist environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/dashboard" className="h-12 px-6 bg-primary text-on-primary font-semibold rounded-md hover:bg-primary-active inline-flex items-center justify-center transition-colors">
              Open Admin Console
            </Link>
            <a href="#modules" className="h-12 px-6 bg-canvas text-ink font-semibold rounded-md border border-hairline hover:bg-surface-soft inline-flex items-center justify-center transition-colors">
              Explore Modules
            </a>
          </div>
        </div>
        
        {/* Hero Code Mockup Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-surface-dark text-on-dark rounded-xl p-5 font-mono text-sm border border-surface-dark-elevated shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4 border-b border-surface-dark-elevated pb-3">
              <span className="w-3 h-3 rounded-full bg-error opacity-75"></span>
              <span className="w-3 h-3 rounded-full bg-accent-amber opacity-75"></span>
              <span className="w-3 h-3 rounded-full bg-success opacity-75"></span>
              <span className="ml-2 text-xs text-on-dark-soft font-sans">aegir-schema.sql</span>
            </div>
            <pre className="text-xs leading-relaxed overflow-x-auto text-on-dark-soft">
              <code>
{`-- Create main entity tables
CREATE TABLE vessels (
  id VARCHAR(36) PRIMARY KEY,
  imo VARCHAR(7) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE berths (
  id VARCHAR(36) PRIMARY KEY,
  number VARCHAR(20) NOT NULL,
  vessel_id VARCHAR(36) REFERENCES vessels(id)
);`}
              </code>
            </pre>
            <div className="absolute right-4 bottom-4">
              <svg className="w-8 h-8 opacity-10 text-on-dark fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section id="modules" className="py-20 bg-surface-soft border-t border-b border-hairline px-6 md:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 max-w-xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-serif text-ink">
              Engineered for absolute operational clarity.
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Every interface and database entity is linked seamlessly to give port administrators granular visibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-xl font-serif text-ink">Automated Berth Allocations</h3>
              <p className="text-body-text text-sm leading-relaxed">
                Streamline berth assignment logic, matching crew parameters with vessel compliance rules and port capacities.
              </p>
            </div>
            
            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-xl font-serif text-ink">Pre-Sea Course Audits</h3>
              <p className="text-body-text text-sm leading-relaxed">
                Ensure all seafarers hold valid certifications. Manage INDOS databases and course enrollments automatically.
              </p>
            </div>
            
            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-xl font-serif text-ink">Immutable Audit Logging</h3>
              <p className="text-body-text text-sm leading-relaxed">
                A permanent audit trail records every insert, update, and delete operation across all database records automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Showcase Section */}
      <section id="terminal" className="py-20 px-6 md:px-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 w-full order-last lg:order-first">
          <div className="bg-surface-dark text-on-dark rounded-lg p-5 font-mono text-sm border border-surface-dark-elevated shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-surface-dark-elevated pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-primary-active"></span>
                <span className="text-xs text-on-dark-soft">Aegir Engine Console</span>
              </div>
              <span className="text-xs text-success bg-success/15 px-2 py-0.5 rounded-md font-semibold">Active</span>
            </div>
            <div className="space-y-1.5 text-xs text-on-dark-soft">
              <p className="text-on-dark font-medium">$ springboot run dev</p>
              <p>[INFO] Starting Aegir Application v0.1.0...</p>
              <p>[INFO] Connecting to postgres://localhost:5432/aegir</p>
              <p>[INFO] Liquibase schema migration: completed successfully</p>
              <p className="text-accent-teal">[INFO] OpenAPI specs loaded: /openapi.yml</p>
              <p className="text-success">[SUCCESS] Server initialized on port 8080</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col gap-5 text-left">
          <h2 className="text-3xl md:text-4xl font-serif text-ink">
            Designed for developers and port operators.
          </h2>
          <p className="text-body-text text-base leading-relaxed">
            The platform is built on modern, secure foundations. The frontend calls a robust, transaction-safe Spring Boot backend via typed API clients, verifying state integrity before recording compliance changes.
          </p>
          <div className="pt-2">
            <Link href="/dashboard" className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors shadow-none">
              Launch Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-footer Callout Coral Band */}
      <section className="mx-6 md:mx-12 my-12 bg-primary text-on-primary rounded-xl p-12 md:p-16 text-center flex flex-col items-center gap-6 max-w-5xl lg:mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-serif max-w-xl leading-tight">
          Coordinate seafarers, vessels, and berths smoothly.
        </h2>
        <p className="text-on-primary/80 text-sm md:text-base max-w-md">
          Access the compliance console now. Manage ranks, enrollments, and active berths from one consolidated workflow.
        </p>
        <div className="pt-2">
          <Link href="/dashboard" className="h-12 px-8 bg-canvas text-primary font-semibold rounded-md hover:bg-surface-soft inline-flex items-center justify-center transition-colors">
            Enter Dashboard Console
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark text-on-dark-soft py-16 px-6 md:px-12 mt-auto border-t border-surface-dark-elevated">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <h4 className="text-on-dark font-serif text-sm font-medium">Product</h4>
            <a href="#system" className="hover:text-on-dark text-xs transition-colors">Aegir Admin</a>
            <a href="#modules" className="hover:text-on-dark text-xs transition-colors">Modules</a>
            <a href="/dashboard" className="hover:text-on-dark text-xs transition-colors">System Dashboard</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-on-dark font-serif text-sm font-medium">Resources</h4>
            <a href="#" className="hover:text-on-dark text-xs transition-colors">API Docs</a>
            <a href="#" className="hover:text-on-dark text-xs transition-colors">System Guide</a>
            <a href="#" className="hover:text-on-dark text-xs transition-colors">OpenAPI Spec</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-on-dark font-serif text-sm font-medium">System Modules</h4>
            <Link href="/vessels" className="hover:text-on-dark text-xs transition-colors">Vessel Registry</Link>
            <Link href="/berths" className="hover:text-on-dark text-xs transition-colors">Berth Allocation</Link>
            <Link href="/audit-logs" className="hover:text-on-dark text-xs transition-colors">Audit Logging</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-on-dark font-serif text-sm font-medium">Platform</h4>
            <span className="text-xs">Spring Boot 3.4</span>
            <span className="text-xs">Next.js 16 (App Router)</span>
            <span className="text-xs">Tailwind CSS v4</span>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto w-full pt-8 border-t border-surface-dark-elevated flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
            </svg>
            <span className="font-serif text-sm font-medium tracking-tight text-on-dark">Aegir Maritime</span>
          </div>
          <p className="text-xs font-mono">&copy; 2026 Aegir Maritime. Built in the warm-editorial style.</p>
        </div>
      </footer>
    </div>
  );
}
