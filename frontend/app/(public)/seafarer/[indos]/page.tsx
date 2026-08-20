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
  getAllInstitutes,
  createEnrollment,
  IndosMasterResponseDTO, 
  RankMasterResponseDTO,
  EnrollmentResponseDTO,
  PreSeaCoursesResponseDTO,
  ContractResponseDTO,
  CompanyResponseDTO,
  InstituteResponseDTO
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
  const [institutes, setInstitutes] = useState<InstituteResponseDTO[]>([]);

  // Navigation state inside the Right column
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "courses" | "addCourses" | "training">("overview");
  const [reportGenerating, setReportGenerating] = useState(false);

  // Add Courses Search & Filter States
  const [instituteSearch, setInstituteSearch] = useState("");
  const [selectedInstIds, setSelectedInstIds] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [enrollingCourse, setEnrollingCourse] = useState<PreSeaCoursesResponseDTO | null>(null);

  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

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
      const [allEnrollments, allCourses, allContracts, allCompanies, allInstitutes] = await Promise.all([
        getAllEnrollments(),
        getAllCourses(),
        getAllContracts(),
        getAllCompanies(),
        getAllInstitutes()
      ]);

      // Filter enrollments and contracts for this seafarer
      const seafarerId = liveSeafarer.id;
      setEnrollments(allEnrollments.filter(e => e.indosMasterId === seafarerId));
      setCourses(allCourses);
      setContracts(allContracts.filter(c => c.indosMasterId === seafarerId));
      setCompanies(allCompanies);
      setInstitutes(allInstitutes);
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

  const handleEnrollClick = (course: PreSeaCoursesResponseDTO) => {
    setEnrollingCourse(course);
    setEnrollError(null);
    setEnrollSuccess(null);
  };

  const handleConfirmEnroll = async () => {
    if (!enrollingCourse || !seafarer) return;
    setEnrolling(true);
    setEnrollError(null);
    setEnrollSuccess(null);
    try {
      await createEnrollment({
        preSeaCourseId: enrollingCourse.id,
        indosMasterId: seafarer.id,
        status: "ENROLLED",
        remarks: ""
      });
      setEnrollSuccess("Enrolled successfully!");
      
      const allEnrollments = await getAllEnrollments();
      setEnrollments(allEnrollments.filter(e => e.indosMasterId === seafarer.id));

      setTimeout(() => {
        setEnrollSuccess(null);
        setEnrollingCourse(null);
      }, 1500);
    } catch (err: any) {
      setEnrollError(err.message || "Failed to enroll in the course.");
    } finally {
      setEnrolling(false);
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
              onClick={() => setActiveDetailTab("courses")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "courses"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Registered Courses
            </button>
            <button
              onClick={() => setActiveDetailTab("addCourses")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "addCourses"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Add Courses
            </button>
            <button
              onClick={() => setActiveDetailTab("training")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeDetailTab === "training"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Training
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
            <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6 min-h-[300px]">
              <div className="text-center py-20 text-xs text-muted">
                Overview KPIs & profile summary section. Space reserved.
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab Content */}
        {activeDetailTab === "courses" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-serif text-ink">Registered Courses</h3>
              <p className="text-xs text-muted mt-0.5">Audited certification compliance under standard pre-sea training registers.</p>
            </div>

            {enrollments.length === 0 ? (
              <div className="border border-dashed border-hairline rounded-lg p-10 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[200px]">
                <svg className="w-8 h-8 opacity-25 text-body-strong stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-xs">No courses registered for this candidate.</span>
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

        {/* Add Courses Tab Content */}
        {activeDetailTab === "addCourses" && (
          <div className="flex flex-col gap-6 p-2 bg-canvas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Institutes Filter checklist */}
              <div className="col-span-1 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Search institutes..."
                  value={instituteSearch}
                  onChange={(e) => setInstituteSearch(e.target.value)}
                  className="w-full text-input px-3 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none text-xs"
                  style={{ height: "34px" }}
                />
                <div className="overflow-x-auto h-[calc(100vh-270px)] overflow-y-auto pb-6">
                  <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                        <th className="px-4 py-3 text-left font-semibold uppercase w-10">Select</th>
                        <th className="px-4 py-3 text-left font-semibold uppercase">Institute Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft text-xs">
                      {institutes
                        .filter((inst) => inst.name.toLowerCase().includes(instituteSearch.toLowerCase()))
                        .map((inst) => {
                          const isChecked = selectedInstIds.includes(inst.id);
                          return (
                            <tr
                              key={inst.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedInstIds((prev) => prev.filter((id) => id !== inst.id));
                                } else {
                                  setSelectedInstIds((prev) => [...prev, inst.id]);
                                }
                              }}
                              className="hover:bg-surface-soft/20 transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedInstIds((prev) => [...prev, inst.id]);
                                    } else {
                                      setSelectedInstIds((prev) => prev.filter((id) => id !== inst.id));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
                                />
                              </td>
                              <td className="px-4 py-3.5 text-body-strong font-medium">
                                {inst.name}
                              </td>
                            </tr>
                          );
                        })}
                      {institutes.filter((inst) => inst.name.toLowerCase().includes(instituteSearch.toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-8 text-center text-sm text-muted">
                            No matching institutes.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Courses List table */}
              <div className="col-span-1 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Search course listings by name..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full text-input px-4 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />

                <div className="overflow-x-auto h-[calc(100vh-270px)] overflow-y-auto pb-6">
                  <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                        <th className="px-4 py-3 text-left font-semibold uppercase">Course Name</th>
                        <th className="px-4 py-3 text-left font-semibold uppercase">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft text-xs">
                      {courses
                        .filter((c) => {
                          const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
                          const matchesInst = selectedInstIds.length === 0 || selectedInstIds.includes(c.instituteId || "");
                          return matchesSearch && matchesInst;
                        })
                        .map((c) => {
                          const instName = institutes.find((i) => i.id === c.instituteId)?.name ?? "Unknown Partner";
                          const isEnrolled = enrollments.some((e) => e.preSeaCourseId === c.id);
                          
                          return (
                            <tr
                              key={c.id}
                              onClick={() => handleEnrollClick(c)}
                              className="hover:bg-surface-soft/20 transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3.5 text-body-strong">
                                <div className="flex flex-col gap-0.5">
                                  <div className="font-semibold flex items-center gap-2">
                                    {c.name}
                                    {isEnrolled && (
                                      <span className="inline-flex px-1.5 py-0.5 bg-success/15 text-success rounded text-[9px] font-bold uppercase tracking-wider">
                                        Enrolled
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-muted font-normal">
                                    {instName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-muted">{c.startDate}</td>
                            </tr>
                          );
                        })}
                      {courses.filter((c) => {
                        const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
                        const matchesInst = selectedInstIds.length === 0 || selectedInstIds.includes(c.instituteId || "");
                        return matchesSearch && matchesInst;
                      }).length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-8 text-center text-sm text-muted">
                            No courses matching the search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab Content */}
        {activeDetailTab === "training" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6 min-h-[300px]">
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-serif text-ink">Training History</h3>
              <p className="text-xs text-muted mt-0.5">Specialized certifications and validation entries.</p>
            </div>
            <div className="border border-dashed border-hairline rounded-lg p-10 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[200px]">
              <span className="text-xs">Training history section. Space reserved.</span>
            </div>
          </div>
        )}

      </div>

      {/* Course Detail Modal / Enroll now */}
      {enrollingCourse && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Course Details</h2>
                <p className="text-[11px] text-muted mt-0.5">Verify program information and enroll.</p>
              </div>
              <button
                onClick={() => {
                  setEnrollingCourse(null);
                  setEnrollError(null);
                  setEnrollSuccess(null);
                }}
                className="text-muted hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs">
              {enrollError && <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">{enrollError}</div>}
              {enrollSuccess && <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">{enrollSuccess}</div>}

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-semibold text-[10px]">Course Name</span>
                  <span className="text-sm font-semibold text-body-strong">{enrollingCourse.name}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-semibold text-[10px]">Institute Partner</span>
                  <span className="text-sm font-medium text-body-strong">
                    {institutes.find((i) => i.id === enrollingCourse.instituteId)?.name ?? "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-semibold text-[10px]">Start Date</span>
                  <span className="text-sm font-mono text-body-strong">{enrollingCourse.startDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEnrollingCourse(null);
                    setEnrollError(null);
                    setEnrollSuccess(null);
                  }}
                  className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEnroll}
                  disabled={enrolling || enrollments.some(e => e.preSeaCourseId === enrollingCourse.id)}
                  className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : enrollments.some(e => e.preSeaCourseId === enrollingCourse.id) ? "Already Enrolled" : "Enroll Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
