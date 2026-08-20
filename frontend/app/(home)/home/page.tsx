import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-2 max-w-3xl mb-8 flex-shrink-0">
        <div>
          <span className="inline-flex items-center bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
            Maritime Public Access Hub
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-ink leading-tight tracking-tight mt-1">
          Connecting seafarers with operational clarity.
        </h1>
        <p className="text-xs md:text-sm text-body-text w-full max-w-2xl leading-relaxed mt-1">
          Verify credentials, check active course enrollments, and check allocations in real-time.
        </p>
      </section>

      {/* Portal Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl flex-shrink-0">
        {/* Card 1: Seafarer Portal */}
        <Link 
          href="/seafarer" 
          className="group relative flex flex-col justify-between p-6 md:p-8 bg-surface-card hover:bg-canvas border border-hairline hover:border-primary rounded-xl transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div>
            {/* Icon Container */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
              <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <h2 className="text-lg md:text-xl font-serif text-ink mb-2 group-hover:text-primary transition-colors duration-300">
              Seafarer Profile Portal
            </h2>
            <p className="text-xs md:text-sm text-body-text mb-4 leading-relaxed">
              Access active seafarer registries, look up compliance profiles, check active ranks, and verify INDOS certifications.
            </p>

            <ul className="text-xs text-muted space-y-1.5 mb-6 border-t border-hairline-soft pt-4 hidden sm:block">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>Individual Profile Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>INDOS Number Status Check</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>Ranks & Compliance Records</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary mt-auto">
            <span>Access Seafarer Portal</span>
            <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>

        {/* Card 2: Course & Institutes Hub */}
        <Link 
          href="/courses" 
          className="group relative flex flex-col justify-between p-6 md:p-8 bg-surface-card hover:bg-canvas border border-hairline hover:border-accent-teal rounded-xl transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div>
            {/* Icon Container */}
            <div className="w-10 h-10 rounded-lg bg-accent-teal/10 text-accent-teal flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-accent-teal group-hover:text-on-primary">
              <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>

            <h2 className="text-lg md:text-xl font-serif text-ink mb-2 group-hover:text-accent-teal transition-colors duration-300">
              Course & Institutes Hub
            </h2>
            <p className="text-xs md:text-sm text-body-text mb-4 leading-relaxed">
              Browse pre-sea training course directories, approved training institutions, and look up details of active courses.
            </p>

            <ul className="text-xs text-muted space-y-1.5 mb-6 border-t border-hairline-soft pt-4 hidden sm:block">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-teal" />
                <span>Approved Institute Directories</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-teal" />
                <span>Pre-Sea Training Course Details</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-teal" />
                <span>Academic Term Schedules</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-accent-teal mt-auto">
            <span>View Training Directory</span>
            <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
