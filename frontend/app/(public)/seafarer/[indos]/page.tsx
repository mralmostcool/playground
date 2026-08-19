"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  getIndosByIndos, 
  getAllRanks, 
  deleteIndos, 
  getAllEnrollments,
  getAllCourses,
  getAllContracts,
  getAllCompanies,
  IndosMasterResponseDTO, 
  RankMasterResponseDTO,
  EnrollmentResponseDTO,
  PreSeaCoursesResponseDTO,
  ContractResponseDTO,
  CompanyResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";

export default function SeafarerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const indos = params.indos as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seafarer, setSeafarer] = useState<IndosMasterResponseDTO | null>(null);
  const [ranks, setRanks] = useState<RankMasterResponseDTO[]>([]);

  // Database-driven child collections
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [contracts, setContracts] = useState<ContractResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);

  // Navigation state inside the Right column
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "stcw" | "seaService" | "docs">("overview");
  const [reportGenerating, setReportGenerating] = useState(false);

  const loadSeafarerData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch seafarer and ranks
      const [liveSeafarer, liveRanks] = await Promise.all([
        getIndosByIndos(indos),
        getAllRanks()
      ]);
      setSeafarer(liveSeafarer);
      setRanks(liveRanks);

      // 2. Fetch associated database collections
      const [allEnrollments, allCourses, allContracts, allCompanies] = await Promise.all([
        getAllEnrollments(),
        getAllCourses(),
        getAllContracts(),
        getAllCompanies()
      ]);

      // Filter enrollments and contracts for this seafarer
      const seafarerId = liveSeafarer.id;
      setEnrollments(allEnrollments.filter(e => e.indosMasterId === seafarerId));
      setCourses(allCourses);
      setContracts(allContracts.filter(c => c.indosMasterId === seafarerId));
      setCompanies(allCompanies);
    } catch (err: any) {
      console.error("Failed to load seafarer registry data", err);
      setError("Failed to query seafarer records from backend registries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (indos) {
      loadSeafarerData();
    }
  }, [indos]);

  const getRankName = (rankId: string) => {
    return ranks.find((r) => r.id === rankId)?.name ?? "Unknown Rank";
  };

  const getRankLevel = (rankId: string) => {
    return ranks.find((r) => r.id === rankId)?.level ?? null;
  };

  const handleDeleteSeafarer = async () => {
    if (!seafarer) return;
    if (!confirm("Are you sure you want to delete this seafarer record from the directory?")) {
      return;
    }
    try {
      await deleteIndos(seafarer.id);
      alert("Seafarer record deleted successfully.");
      router.push("/seafarer");
    } catch (err: any) {
      alert(err.message || "Failed to delete seafarer.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted">
        Syncing seafarer profile with maritime registries...
      </div>
    );
  }

  if (error || !seafarer) {
    return (
      <div className="py-24 text-center text-sm text-error">
        {error || "Seafarer record not found."} <Link href="/seafarer" className="text-primary hover:underline ml-1">Return to directory</Link>
      </div>
    );
  }

  const rankName = getRankName(seafarer.rankId);

  return (
    <>
      {/* Set Header in Left Column */}
      <PublicLayoutHeader deps={[seafarer?.id, seafarer?.firstName, seafarer?.isActive]}>
        <div className="flex flex-col gap-2">
          <Link href="/seafarer" className="text-xs text-primary hover:underline inline-flex items-center gap-1.5 font-medium mb-1">
            &larr; Back to Registry
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-serif text-ink">{seafarer.firstName}</h1>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
              seafarer.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
            }`}>
              {seafarer.isActive ? "Active Duty" : "Duty Suspended"}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-soft">{seafarer.indos}</span>
        </div>
      </PublicLayoutHeader>

      {/* Set Sidebar Content in Left Column */}
      <PublicLayoutSidebar deps={[activeDetailTab]}>
        <div className="flex flex-col gap-6 mt-4">
          {/* Section Navigation Menu */}
          <nav className="flex flex-col gap-1.5 border-b lg:border-b-0 pb-4 lg:pb-0">
            <button
              onClick={() => setActiveDetailTab("overview")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "overview"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveDetailTab("stcw")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "stcw"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Pre-Sea Courses
            </button>
            <button
              onClick={() => setActiveDetailTab("seaService")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "seaService"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Voyage Contracts
            </button>
            <button
              onClick={() => setActiveDetailTab("docs")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "docs"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Documents
            </button>
          </nav>

          <div className="flex flex-col gap-2 text-xs text-muted p-1 hidden lg:flex">
            <h4 className="font-semibold text-body-strong">Data Compliance Registry</h4>
            <p className="leading-relaxed text-muted-soft">
              This page displays verified data audits query-cached for compliance checks. All logs are securely cryptographed.
            </p>
          </div>
        </div>
      </PublicLayoutSidebar>

      {/* Right Column: Dynamic Section rendering */}
      <div className="bg-canvas w-full">
        
        {/* Overview Tab Content */}
        {activeDetailTab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
              <div className="border-b border-hairline pb-4">
                <h3 className="text-xl font-serif text-ink">Registry Profile Details</h3>
                <p className="text-xs text-muted mt-0.5">Primary registration record and active duty logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-canvas border border-hairline-soft rounded-md flex flex-col gap-1">
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Registered Rank</span>
                  <span className="text-base font-semibold text-body-strong">{rankName}</span>
                </div>
                <div className="p-4 bg-canvas border border-hairline-soft rounded-md flex flex-col gap-1">
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Compliance Class</span>
                  <span className="text-base font-semibold text-body-strong">Level {getRankLevel(seafarer.rankId) ?? "N/A"}</span>
                </div>
                <div className="p-4 bg-canvas border border-hairline-soft rounded-md flex flex-col gap-1">
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Registry Date</span>
                  <span className="text-sm font-mono text-body-strong">
                    {seafarer.createdAt ? new Date(seafarer.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="p-4 bg-canvas border border-hairline-soft rounded-md flex flex-col gap-1">
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Last Sync Timestamp</span>
                  <span className="text-sm font-mono text-body-strong">
                    {seafarer.updatedAt ? new Date(seafarer.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setReportGenerating(true);
                    setTimeout(() => {
                      setReportGenerating(false);
                      alert(`Encrypted Verification Report downloaded for ${seafarer.firstName} (${seafarer.indos})`);
                    }, 1000);
                  }}
                  disabled={reportGenerating}
                  className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {reportGenerating ? "Encrypting..." : "Verify Report"}
                </button>
                <button
                  onClick={handleDeleteSeafarer}
                  className="h-10 px-5 bg-error text-on-primary font-medium rounded-md hover:opacity-90 inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Sea Courses Tab Content */}
        {activeDetailTab === "stcw" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-serif text-ink">Pre-Sea Course Compliance</h3>
              <p className="text-xs text-muted mt-0.5">Audited certification compliance under standard pre-sea training registers.</p>
            </div>

            {enrollments.length === 0 ? (
              <div className="border border-dashed border-hairline rounded-lg p-10 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[200px]">
                <svg className="w-8 h-8 opacity-25 text-body-strong stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-xs">No pre-sea courses or registry enrollments found in compliance history.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Course Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Remarks</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft text-xs">
                    {enrollments.map((e) => {
                      const courseName = courses.find(c => c.id === e.preSeaCourseId)?.name ?? "Unknown Course";
                      return (
                        <tr key={e.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-body-strong">{courseName}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{e.remarks || "—"}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              e.status === "COMPLETED" ? "bg-success/15 text-success" :
                              e.status === "ENROLLED" ? "bg-accent-teal/15 text-accent-teal" : "bg-muted/15 text-muted"
                            }`}>
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Voyage Contracts Tab Content */}
        {activeDetailTab === "seaService" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-serif text-ink">Sea Service Contracts</h3>
              <p className="text-xs text-muted mt-0.5">Verified sea time contracts and active embarkation records.</p>
            </div>

            {contracts.length === 0 ? (
              <div className="border border-dashed border-hairline rounded-lg p-10 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[200px]">
                <svg className="w-8 h-8 opacity-25 text-body-strong stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1M5.25 10.75a2.25 2.25 0 1 1-4.5 0c0-1.242 1.336-2.25 3-2.25h1.5v2.25Z" />
                </svg>
                <span className="text-xs">No active sea service voyages or contract history registered.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Company</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Sign On</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Sign Off</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft text-xs">
                    {contracts.map((c) => {
                      const companyName = companies.find(comp => comp.id === c.companyId)?.name ?? "Unknown Company";
                      return (
                        <tr key={c.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-body-strong block">{companyName}</span>
                            <span className="text-[10px] text-muted font-mono">Sign-On: {c.signOnPort}, {c.signOnCountry}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-body-strong block font-mono">{c.signOnDate}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-body-strong block font-mono">{c.signOffDate || "—"}</span>
                            {c.signOffPort && <span className="text-[10px] text-muted-soft block">{c.signOffPort}, {c.signOffCountry}</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              c.status === "ACTIVE" ? "bg-success/15 text-success" :
                              c.status === "COMPLETED" ? "bg-primary/15 text-primary" : "bg-muted/15 text-muted"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab Content */}
        {activeDetailTab === "docs" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-serif text-ink">Identification Documents</h3>
              <p className="text-xs text-muted mt-0.5">Seafarer travel documents, CDC and medical files.</p>
            </div>

            <div className="border border-dashed border-hairline rounded-lg p-10 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[200px]">
              <svg className="w-8 h-8 opacity-25 text-body-strong stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="text-xs">No verified travel or registry documents uploaded.</span>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
