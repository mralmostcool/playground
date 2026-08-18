import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div>
            <span className="inline-flex items-center bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full tracking-wider uppercase">
              Maritime Public Access Hub
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink leading-tight tracking-tight">
            Connecting seafarers with operational clarity.
          </h1>
          <p className="text-lg leading-relaxed text-body-text w-full max-w-[36rem]">
            Verify credentials, audit course enrollments, and check allocations in real-time. Aegir Maritime provides port administrators and seafarers with an integrated, secure, and warm humanist environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/seafarer" className="h-12 px-6 bg-primary text-on-primary font-semibold rounded-md hover:bg-primary-active inline-flex items-center justify-center transition-colors">
              Access Seafarer Portal
            </Link>
            <Link href="/dashboard" className="h-12 px-6 bg-canvas text-ink font-semibold rounded-md border border-hairline hover:bg-surface-soft inline-flex items-center justify-center transition-colors">
              Administrative Console
            </Link>
          </div>
        </div>

        {/* Editorial Illustration Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-surface-card border border-hairline rounded-xl p-8 relative overflow-hidden flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <span className="text-sm font-serif font-medium text-ink">Credential Validation</span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal"></span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-hairline-soft pb-2">
                <span className="text-muted">SERVICE CLASS</span>
                <span className="font-mono font-medium text-body-strong">Class-1 Deck Officer</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-hairline-soft pb-2">
                <span className="text-muted">VALIDITY REGISTRY</span>
                <span className="font-mono font-medium text-body-strong">IN-1992038</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1">
                <span className="text-muted">COMPLIANCE STATUS</span>
                <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded-md font-semibold">Fully Valid</span>
              </div>
            </div>

            <div className="bg-canvas border border-hairline-soft rounded-lg p-4 text-xs font-mono text-muted flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <svg className="w-3.5 h-3.5 text-primary fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                </svg>
                <span>Verification Hash</span>
              </div>
              <p className="truncate">sha256:7f920da081a2e99d8b18ec0db9b2b0ac92</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section className="py-20 bg-surface-soft border-t border-b border-hairline px-6 md:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 w-full max-w-[36rem] mx-auto flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-serif text-ink">
              Granular compliance overview.
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Every registry check is linked with active course registrations and company allocations to ensure safety compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif">
                01
              </div>
              <h3 className="text-xl font-serif text-ink">INDOS Verification</h3>
              <p className="text-body-text text-sm leading-relaxed">
                Direct lookup of INDOS registrations with real-time status updates, active rank assignments, and vessel compatibility indicators.
              </p>
            </div>

            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif">
                02
              </div>
              <h3 className="text-xl font-serif text-ink">Pre-Sea Audits</h3>
              <p className="text-body-text text-sm leading-relaxed">
                Ensure seafarers hold valid active certifications. Check pre-sea course enrollments, status logs, and institute records.
              </p>
            </div>

            <div className="bg-surface-card p-8 rounded-lg border border-hairline-soft flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif">
                03
              </div>
              <h3 className="text-xl font-serif text-ink">Berth Orchestration</h3>
              <p className="text-body-text text-sm leading-relaxed">
                Smooth integration connecting active profiles directly with vessel berth assignments and immutable contract tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer Callout Coral Band */}
      <section className="mx-6 md:mx-12 my-16 bg-primary text-on-primary rounded-xl p-12 md:p-16 text-center flex flex-col items-center gap-6 max-w-5xl lg:mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-serif max-w-xl leading-tight">
          Coordinate seafarers, vessels, and berths smoothly.
        </h2>
        <p className="text-on-primary/80 text-sm md:text-base w-full max-w-[28rem]">
          Access the administrative console to manage registries, update vessel configurations, and oversee active berth assignments.
        </p>
        <div className="pt-2">
          <Link href="/dashboard" className="h-12 px-8 bg-canvas text-primary font-semibold rounded-md hover:bg-surface-soft inline-flex items-center justify-center transition-colors">
            Enter Dashboard Console
          </Link>
        </div>
      </section>
    </div>
  );
}

