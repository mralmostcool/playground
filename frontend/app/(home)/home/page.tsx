"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllIndos,
  getAllVessels,
  getAllBerths,
  getAllContracts,
  getAllAuditLogs,
  AuditLogsResponseDTO
} from "@/lib/apiClient";
import { useToast } from "@/components/ui";

export default function HomePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Dashboard Live Stats
  const [stats, setStats] = useState({
    seafarers: 0,
    vessels: 0,
    berths: 0,
    contracts: 0
  });

  // Recent Activity Log
  const [activity, setActivity] = useState<AuditLogsResponseDTO[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        seafarerList,
        vesselList,
        berthList,
        contractList,
        auditLogsList
      ] = await Promise.all([
        getAllIndos(),
        getAllVessels(),
        getAllBerths(),
        getAllContracts(),
        getAllAuditLogs()
      ]);

      setStats({
        seafarers: seafarerList.length,
        vessels: vesselList.length,
        berths: berthList.length,
        contracts: contractList.filter((c) => c.status === "ACTIVE").length
      });

      // Sort and take top 5 recent logs
      const sortedLogs = auditLogsList
        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
        .slice(0, 5);
      setActivity(sortedLogs);
    } catch (err) {
      console.error("Failed to load dashboard statistics", err);
      toast("Error loading system metrics", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10 font-sans">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-3 max-w-3xl mx-auto">
        <div>
          <span className="inline-flex items-center bg-primary text-on-primary text-xs font-semibold px-4 py-1 rounded-full tracking-wider uppercase">
            Maritime Operations Portal
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-ink leading-tight tracking-tight mt-1">
          Connecting seafarers with operational clarity.
        </h1>
        <p className="text-xs md:text-sm text-body-text w-full max-w-2xl leading-relaxed">
          Verify credentials, check active course enrollments, and coordinate shipboard berth allocations in real-time.
        </p>
      </section>

      {/* Live Operational Metrics Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-surface-card border border-hairline rounded-xl p-6 shadow-xs">
        {[
          { label: "Registered Seafarers", value: stats.seafarers, color: "text-primary" },
          { label: "Active Vessels", value: stats.vessels, color: "text-accent-teal" },
          { label: "Vessel Berths", value: stats.berths, color: "text-accent-amber" },
          { label: "Active Sea Contracts", value: stats.contracts, color: "text-success" }
        ].map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-1 border-r last:border-0 border-hairline/60 pr-4 md:pl-4 first:pl-0">
            <span className={`text-3xl font-serif font-bold ${stat.color}`}>
              {loading ? "..." : stat.value}
            </span>
            <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Portal Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[
          {
            href: "/seafarer",
            title: "Seafarer Directory",
            desc: "Look up compliance profiles, view ranks, and verify INDOS certifications.",
            color: "hover:border-primary text-primary bg-primary/5",
            btnText: "Seafarers"
          },
          {
            href: "/courses",
            title: "Nautical Academy",
            desc: "Browse pre-sea training course directories and approved academic colleges.",
            color: "hover:border-accent-teal text-accent-teal bg-accent-teal/5",
            btnText: "Colleges"
          },
          {
            href: "/companies",
            title: "Shipping Carriers",
            desc: "Verify registered carriers, manage vessel fleets, and check berths.",
            color: "hover:border-accent-amber text-accent-amber bg-accent-amber/5",
            btnText: "Carriers"
          },
          {
            href: "/berths",
            title: "Training Berths",
            desc: "Audit shipboard training berths and current trainee schedules.",
            color: "hover:border-success text-success bg-success/5",
            btnText: "Berths"
          }
        ].map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group flex flex-col justify-between p-6 bg-surface-card hover:bg-canvas border border-hairline rounded-xl transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono mb-4 ${card.color}`}>
                {card.btnText}
              </span>
              <h2 className="text-md font-serif text-ink mb-2 group-hover:text-primary transition-colors">
                {card.title}
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-6 pt-3 border-t border-hairline-soft/60">
              <span>Enter Portal</span>
              <svg className="w-3 h-3 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity Log audit feed */}
      <div className="bg-surface-card border border-hairline rounded-xl p-6 w-full flex flex-col gap-4">
        <div>
          <h3 className="text-md font-serif text-ink mb-1">Recent Activity Logs</h3>
          <p className="text-[11px] text-muted leading-relaxed">Live updates from maritime compliance registries.</p>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-muted">Syncing activity ledger...</div>
        ) : activity.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted">No recent operations logged.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {activity.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-canvas border border-hairline-soft rounded-lg text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                    log.operation === "INSERT" ? "bg-success/15 text-success" :
                    log.operation === "UPDATE" ? "bg-primary/15 text-primary" : "bg-error/15 text-error"
                  }`}>
                    {log.operation}
                  </span>
                  <div>
                    <span className="font-semibold text-body-strong font-mono uppercase tracking-wider">{log.tableName}</span>
                    <span className="text-muted ml-2">Record ID: {log.recordId.substring(0, 8)}...</span>
                  </div>
                </div>
                <div className="text-muted-soft font-mono text-[10px] mt-1 sm:mt-0">
                  {new Date(log.changedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
