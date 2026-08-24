"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllIndos,
  getAllVessels,
  getAllBerths,
  getAllContracts,
  getAllCompanies,
  getAllInstitutes,
  getAllCourses,
  getAllEnrollments,
  getAllAuditLogs,
  AuditLogsResponseDTO
} from "@/lib/apiClient";
import { useToast } from "@/components/ui";

type RoleId = "candidate" | "company" | "academy";

export default function HomePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Role State (persist in localStorage if client side)
  const [selectedRole, setSelectedRole] = useState<RoleId>("candidate");

  // Dashboard Live Stats
  const [stats, setStats] = useState({
    seafarers: 0,
    vessels: 0,
    berths: 0,
    contracts: 0,
    companies: 0,
    institutes: 0,
    courses: 0,
    enrollments: 0
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
        companyList,
        instituteList,
        courseList,
        enrollmentList,
        auditLogsList
      ] = await Promise.all([
        getAllIndos(),
        getAllVessels(),
        getAllBerths(),
        getAllContracts(),
        getAllCompanies(),
        getAllInstitutes(),
        getAllCourses(),
        getAllEnrollments(),
        getAllAuditLogs()
      ]);

      setStats({
        seafarers: seafarerList.length,
        vessels: vesselList.length,
        berths: berthList.length,
        contracts: contractList.length,
        companies: companyList.length,
        institutes: instituteList.length,
        courses: courseList.length,
        enrollments: enrollmentList.length
      });

      // Sort and store logs
      const sortedLogs = auditLogsList.sort(
        (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
      );
      setActivity(sortedLogs);
    } catch (err) {
      console.error("Failed to load dashboard statistics", err);
      toast("Error loading system metrics", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load from localStorage if present
    const saved = localStorage.getItem("selectedDashboardRole");
    if (saved === "candidate" || saved === "company" || saved === "academy") {
      setSelectedRole(saved);
    }
    loadDashboardData();
  }, []);

  const handleRoleChange = (role: RoleId) => {
    setSelectedRole(role);
    localStorage.setItem("selectedDashboardRole", role);
    toast(`Switched to ${role.toUpperCase()} workspace dashboard`, "info");
  };

  // Filter logs based on active role context
  const getFilteredLogs = () => {
    return activity
      .filter((log) => {
        const table = log.tableName.toLowerCase();
        if (selectedRole === "candidate") {
          return table.includes("indos") || table.includes("contract") || table.includes("seafarer");
        } else if (selectedRole === "company") {
          return table.includes("company") || table.includes("vessel") || table.includes("berth_allocation") || table.includes("contract");
        } else {
          return table.includes("institute") || table.includes("course") || table.includes("enrollment");
        }
      })
      .slice(0, 5);
  };

  const filteredLogs = getFilteredLogs();

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8 font-sans">
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

      {/* Role workspace Switcher Segmented Control */}
      <div className="flex justify-center mt-2 flex-shrink-0">
        <div className="bg-surface-soft border border-hairline p-1 rounded-xl flex gap-1 shadow-xs max-w-full overflow-x-auto">
          {[
            { id: "candidate", label: "Maritime Candidate" },
            { id: "company", label: "Shipping Company" },
            { id: "academy", label: "Nautical Academy" }
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id as RoleId)}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer whitespace-nowrap ${
                selectedRole === role.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-muted hover:text-ink hover:bg-surface-cream-strong/50"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Subheading Header */}
      <div className="border-b border-hairline-soft pb-4 mt-2">
        <h2 className="text-xl font-serif text-ink capitalize">
          {selectedRole === "candidate" && "Candidate Self-Service Workspace"}
          {selectedRole === "company" && "Shipping Carrier & Fleet Operations"}
          {selectedRole === "academy" && "Academy Training Registrars Desk"}
        </h2>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          {selectedRole === "candidate" && "Verify INDOS certification records, check academic enrollment logs, and audit active contract schedules."}
          {selectedRole === "company" && "Register shipping companies, manage carrier vessels, allocate training berths, and draft seafarer contracts."}
          {selectedRole === "academy" && "Inspect approved institutes registers, publish pre-sea course programs, and update candidate course completions."}
        </p>
      </div>

      {/* Live Operational Metrics Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full bg-surface-card border border-hairline rounded-xl p-6 shadow-xs">
        {selectedRole === "candidate" && (
          <>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4">
              <span className="text-3xl font-serif font-bold text-primary">{loading ? "..." : stats.seafarers}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Registered Candidates</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-serif font-bold text-success">{loading ? "..." : stats.contracts}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Sea Contracts Logged</span>
            </div>
          </>
        )}
        {selectedRole === "company" && (
          <>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4">
              <span className="text-3xl font-serif font-bold text-primary">{loading ? "..." : stats.companies}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Registered Carriers</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4 lg:pl-4">
              <span className="text-3xl font-serif font-bold text-accent-teal">{loading ? "..." : stats.vessels}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Fleet Vessels</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4 lg:pl-4">
              <span className="text-3xl font-serif font-bold text-accent-amber">{loading ? "..." : stats.berths}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Allocated Berths</span>
            </div>
            <div className="flex flex-col gap-1 lg:pl-4">
              <span className="text-3xl font-serif font-bold text-success">{loading ? "..." : stats.contracts}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Sea Contracts</span>
            </div>
          </>
        )}
        {selectedRole === "academy" && (
          <>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4">
              <span className="text-3xl font-serif font-bold text-primary">{loading ? "..." : stats.institutes}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Approved Academies</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-hairline/60 pr-4 lg:pl-4">
              <span className="text-3xl font-serif font-bold text-accent-teal">{loading ? "..." : stats.courses}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Pre-Sea Programs</span>
            </div>
            <div className="flex flex-col gap-1 lg:pl-4">
              <span className="text-3xl font-serif font-bold text-success">{loading ? "..." : stats.enrollments}</span>
              <span className="text-[10px] text-muted-soft font-mono uppercase tracking-wider font-semibold">Active Enrollments</span>
            </div>
          </>
        )}
      </div>

      {/* Portal Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {selectedRole === "candidate" && (
          <>
            {[
              {
                href: "/seafarer",
                title: "Credentials Profile",
                desc: "Check active INDOS, lookup your profile registry details, and verify rank compliance.",
                color: "hover:border-primary text-primary bg-primary/5",
                btnText: "My Profile"
              },
              {
                href: "/courses",
                title: "Curriculum Registry",
                desc: "Browse approved Pre-Sea training course listings and view upcoming session starts.",
                color: "hover:border-accent-teal text-accent-teal bg-accent-teal/5",
                btnText: "Programs"
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
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-6 pt-3 border-t border-hairline-soft/60">
                  <span>Open Portal</span>
                  <svg className="w-3 h-3 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </>
        )}

        {selectedRole === "company" && (
          <>
            {[
              {
                href: "/companies",
                title: "Registered Carriers",
                desc: "Manage registered shipping companies, audit active fleets, and verify carriers details.",
                color: "hover:border-primary text-primary bg-primary/5",
                btnText: "Companies"
              },
              {
                href: "/vessels",
                title: "Active Fleet Vessels",
                desc: "Browse merchant vessels, verify IMO identifiers, and check Flag state listings.",
                color: "hover:border-accent-teal text-accent-teal bg-accent-teal/5",
                btnText: "Vessels"
              },
              {
                href: "/berths",
                title: "Training Berths Log",
                desc: "Audit vessel training berths allocations timeline and check cadet boarding vacancies.",
                color: "hover:border-accent-amber text-accent-amber bg-accent-amber/5",
                btnText: "Berths"
              },
              {
                href: "/contracts/new",
                title: "Draft Sea Contract",
                desc: "Launch the contract wizard to dispatch graduated seafarer cadets to active vessel berths.",
                color: "hover:border-success text-success bg-success/5",
                btnText: "Contract Wizard"
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
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-6 pt-3 border-t border-hairline-soft/60">
                  <span>Open Portal</span>
                  <svg className="w-3 h-3 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </>
        )}

        {selectedRole === "academy" && (
          <>
            {[
              {
                href: "/courses",
                title: "Academy Programs",
                desc: "Manage approved pre-sea training course programs, academic curriculums, and college branches.",
                color: "hover:border-primary text-primary bg-primary/5",
                btnText: "Colleges & Courses"
              },
              {
                href: "/seafarer",
                title: "Candidate Enrollment",
                desc: "Admit new cadet seafarers into pre-sea academic programs, or log program course completions.",
                color: "hover:border-accent-teal text-accent-teal bg-accent-teal/5",
                btnText: "Admissions"
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
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-6 pt-3 border-t border-hairline-soft/60">
                  <span>Open Portal</span>
                  <svg className="w-3 h-3 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Recent activity Log audit feed */}
      <div className="bg-surface-card border border-hairline rounded-xl p-6 w-full flex flex-col gap-4">
        <div>
          <h3 className="text-md font-serif text-ink mb-1">Recent Activity Logs</h3>
          <p className="text-[11px] text-muted leading-relaxed">
            Live updates filtered by active {selectedRole} workspace registry keys.
          </p>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-muted">Syncing activity ledger...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted">No recent operations logged for this workspace.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLogs.map((log) => (
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
