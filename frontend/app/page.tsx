import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-canvas text-body-text font-sans flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Decorative top colored border */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent-amber to-accent-teal w-full flex-shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4 md:py-8 max-w-4xl mx-auto w-full overflow-hidden">
        {/* Branding Header */}
        <div className="flex flex-col items-center gap-2 text-center mb-6 md:mb-8 flex-shrink-0">
          <div className="mt-1">
            <h1 className="text-2xl md:text-3xl font-serif text-ink tracking-tight">Portal Gateway</h1>
          </div>
          <p className="text-xs md:text-sm text-muted w-full mt-2 leading-relaxed">
            Welcome to the operational gateway. Please select the appropriate portal below to access your workspace.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl flex-shrink-0">
          {/* Option A: Admin Dashboard */}
          <Link 
            href="/dashboard" 
            className="group relative flex flex-col justify-between p-6 md:p-8 bg-surface-card hover:bg-canvas border border-hairline hover:border-primary rounded-xl transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
              </div>

              <h2 className="text-lg md:text-xl font-serif text-ink mb-2 group-hover:text-primary transition-colors duration-300">
                Administrative Dashboard
              </h2>
              <p className="text-xs md:text-sm text-body-text mb-4 leading-relaxed">
                Secure portal for port authorities and managers to orchestrate seafarer courses, vessel records, and berths.
              </p>

              {/* Feature bullet list */}
              <ul className="text-xs text-muted space-y-1.5 mb-6 border-t border-hairline-soft pt-4 hidden sm:block">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>Seafarer Roster & INDOS Registry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>Berth Allocation Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>Immutable Operations Audit Log</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary mt-auto">
              <span>Launch Dashboard Console</span>
              <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>

          {/* Option B: Public Access Hub */}
          <Link 
            href="/home" 
            className="group relative flex flex-col justify-between p-6 md:p-8 bg-surface-card hover:bg-canvas border border-hairline hover:border-accent-teal rounded-xl transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-lg bg-accent-teal/10 text-accent-teal flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-accent-teal group-hover:text-on-primary">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" />
                </svg>
              </div>

              <h2 className="text-lg md:text-xl font-serif text-ink mb-2 group-hover:text-accent-teal transition-colors duration-300">
                Public Access Portal
              </h2>
              <p className="text-xs md:text-sm text-body-text mb-4 leading-relaxed">
                Open hub for seafarers to perform self-service credential checks, search active course listings, and verify logs.
              </p>

              {/* Feature bullet list */}
              <ul className="text-xs text-muted space-y-1.5 mb-6 border-t border-hairline-soft pt-4 hidden sm:block">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-teal" />
                  <span>Real-time Credential Validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-teal" />
                  <span>Public Ranks & Registry Search</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-teal" />
                  <span>Port Schedules & Bulletins</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-accent-teal mt-auto">
              <span>Enter Public Portal</span>
              <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Security / Audit Warning */}
        <div className="mt-6 md:mt-8 flex items-center gap-2 text-xs text-muted border border-hairline-soft bg-surface-soft px-4 py-2.5 rounded-lg flex-shrink-0 max-w-full">
          <svg className="w-4 h-4 text-primary fill-none stroke-current flex-shrink-0" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-mono truncate">Authorized maritime personnel only. All access attempts are recorded.</span>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between px-8 text-xs text-muted font-mono bg-surface-soft w-full flex-shrink-0">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="font-serif text-sm font-medium text-ink">System Portal</span>
        </div>
        <div>
          <span>&copy; 2026. Platform: Spring Boot & Next.js.</span>
        </div>
      </footer>
    </div>
  );
}
