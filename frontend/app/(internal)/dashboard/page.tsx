"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  getAllIndos, 
  getAllVessels, 
  getAllBerths, 
  getAllBerthAllocations, 
  getAllContracts, 
  getAllCourses, 
  getAllAuditLogs,
  getAllCompanies,
  getAllInstitutes,
  getAllEnrollments,
  AuditLogsResponseDTO,
  ContractResponseDTO,
  BerthAllocationResponseDTO,
  PreSeaCoursesResponseDTO,
  VesselResponseDTO
} from "@/lib/apiClient";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Counts
  const [companiesCount, setCompaniesCount] = useState(0);
  const [vesselsCount, setVesselsCount] = useState(0);
  const [activeVesselsCount, setActiveVesselsCount] = useState(0);
  const [vesselList, setVesselList] = useState<VesselResponseDTO[]>([]);
  
  const [institutesCount, setInstitutesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [courseList, setCourseList] = useState<PreSeaCoursesResponseDTO[]>([]);
  
  // Student / Enrollment Funnel
  const [seafarersCount, setSeafarersCount] = useState(0);
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  const [completedStudents, setCompletedStudents] = useState(0);
  const [cancelledStudents, setCancelledStudents] = useState(0);

  // Berth Occupancy
  const [totalBerths, setTotalBerths] = useState(0);
  const [occupiedBerths, setOccupiedBerths] = useState(0);
  const [berthUtilization, setBerthUtilization] = useState(0);
  const [allocationsList, setAllocationsList] = useState<BerthAllocationResponseDTO[]>([]);

  // Contracts & Boarding (Sign-On / Sign-Off)
  const [onBoardCount, setOnBoardCount] = useState(0);
  const [trainingCompletedCount, setTrainingCompletedCount] = useState(0);
  const [pendingBoardingCount, setPendingBoardingCount] = useState(0);
  const [recentContracts, setRecentContracts] = useState<ContractResponseDTO[]>([]);

  // Names Maps for lookups
  const [seafarerNames, setSeafarerNames] = useState<Map<string, string>>(new Map());
  const [companyNames, setCompanyNames] = useState<Map<string, string>>(new Map());
  const [vesselNames, setVesselNames] = useState<Map<string, string>>(new Map());
  const [berthNames, setBerthNames] = useState<Map<string, string>>(new Map());
  const [instituteNames, setInstituteNames] = useState<Map<string, string>>(new Map());

  const [auditLogs, setAuditLogs] = useState<AuditLogsResponseDTO[]>([]);
  const [latency, setLatency] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const triggerFetch = () => setRetryCount(prev => prev + 1);
  const lastLogIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchData(isInitial = false) {
      const startTime = performance.now();
      try {
        if (active && isInitial) setLoading(true);
        
        // 1. Fetch audit logs first to see if database state changed
        const logs = await getAllAuditLogs();
        const sortedLogs = logs.sort((a, b) => 
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
        );
        const hasLogs = sortedLogs.length > 0;
        const latestLogId = hasLogs ? sortedLogs[0].id : null;

        // Skip fetching other tables if not initial load, logs exist, and latest log ID is unchanged
        if (!isInitial && hasLogs && latestLogId === lastLogIdRef.current) {
          if (active) {
            const endTime = performance.now();
            setLatency(Math.round(endTime - startTime));
          }
          return;
        }

        // 2. Fetch other tables in parallel
        const [
          seafarers,
          vessels,
          berths,
          allocations,
          contracts,
          courses,
          companies,
          institutes,
          enrollments
        ] = await Promise.all([
          getAllIndos(),
          getAllVessels(),
          getAllBerths(),
          getAllBerthAllocations(),
          getAllContracts(),
          getAllCourses(),
          getAllCompanies(),
          getAllInstitutes(),
          getAllEnrollments()
        ]);
        
        if (!active) return;
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));

        // Update log ID cache ref
        lastLogIdRef.current = latestLogId;

        // Core lookup maps
        const sMap = new Map(seafarers.map(s => [s.id, s.firstName]));
        const cMap = new Map(companies.map(c => [c.id, c.name]));
        const vMap = new Map(vessels.map(v => [v.id, v.name]));
        const bMap = new Map(berths.map(b => [b.id, b.berthName]));
        const iMap = new Map(institutes.map(i => [i.id, i.name]));
        
        setSeafarerNames(sMap);
        setCompanyNames(cMap);
        setVesselNames(vMap);
        setBerthNames(bMap);
        setInstituteNames(iMap);

        // Shipping & Fleet Metrics
        setCompaniesCount(companies.length);
        setVesselsCount(vessels.length);
        setActiveVesselsCount(vessels.filter(v => v.isActive).length);
        setVesselList(vessels.slice(0, 4));

        // Curriculum & Academics
        setInstitutesCount(institutes.length);
        setCoursesCount(courses.length);
        setCourseList(courses.slice(0, 4));

        // Enrollments Funnel
        setSeafarersCount(seafarers.length);
        setEnrolledStudents(enrollments.filter(e => e.status === "ENROLLED").length);
        setCompletedStudents(enrollments.filter(e => e.status === "COMPLETED").length);
        setCancelledStudents(enrollments.filter(e => e.status === "CANCELLED").length);

        // Berth Utilization
        setTotalBerths(berths.length);
        const occupiedBerthIds = new Set(allocations.map(a => a.berthId));
        setOccupiedBerths(occupiedBerthIds.size);
        setBerthUtilization(berths.length > 0 ? Math.round((occupiedBerthIds.size / berths.length) * 100) : 0);
        setAllocationsList(allocations.slice(0, 4));

        // Boarding / Contracts (Sign On / Sign Off)
        const onboard = contracts.filter(c => c.actualSignOnDate && !c.actualSignOffDate);
        const signedOff = contracts.filter(c => c.actualSignOnDate && c.actualSignOffDate);
        const pending = contracts.filter(c => !c.actualSignOnDate);

        setOnBoardCount(onboard.length);
        setTrainingCompletedCount(signedOff.length);
        setPendingBoardingCount(pending.length);
        
        // Show latest contracts signed/active
        const sortedContracts = [...contracts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentContracts(sortedContracts.slice(0, 5));

        // System Audit Stream
        setAuditLogs(sortedLogs.slice(0, 6));

        setError(null);
      } catch (err) {
        console.error(err);
        if (active) setError("Could not reach live API. Ensure backend is running.");
      } finally {
        if (active && isInitial) setLoading(false);
      }
    }
    
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [retryCount]);

  const studentCompletionRate = (completedStudents + enrolledStudents) > 0
    ? Math.round((completedStudents / (completedStudents + enrolledStudents + cancelledStudents)) * 100)
    : 0;

  const placementRate = seafarersCount > 0
    ? Math.round(((onBoardCount + trainingCompletedCount) / seafarersCount) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Overview Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-hairline-soft pb-6">
        <div>
          <h1 className="text-3xl font-serif text-ink tracking-tight">System Control Center</h1>
          <p className="text-xs text-muted mt-0.5">Real-time placement records, fleet registry operations, and boarding contracts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-surface-soft border border-hairline px-3 py-1.5 rounded-lg text-xs font-mono">
            <span>Latency: </span>
            <span className="font-semibold text-accent-teal">{latency}ms</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${error ? "bg-error" : "bg-success animate-ping"}`} />
            <span className="text-body-strong font-medium">{error ? "API Proxy Offline" : "Live System Monitor"}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-error/15 border border-error text-error text-xs rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-error fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-mono">{error}</span>
          </div>
          <button 
            onClick={triggerFetch} 
            className="px-3 py-1.5 bg-error text-on-primary font-sans font-semibold rounded-md text-xs hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* SECTION 1: Pipeline Flow Chart (Spans Full Width) */}
      <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono">Workflow</span>
            <h2 className="text-lg font-serif text-ink mt-0.5">Candidate Lifecycle Pipeline</h2>
          </div>
          <span className="text-[10px] bg-accent-teal/10 text-accent-teal px-2 py-0.5 rounded font-mono">Online</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Phase 1: Academics */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors">
            <div>
              <span className="text-[9px] text-muted font-mono uppercase block">Stage 1. Academy</span>
              <h3 className="text-2xl font-bold text-ink mt-2">{coursesCount}</h3>
              <p className="text-xxs text-muted mt-1">Pre-sea courses active</p>
            </div>
            <div className="border-t border-hairline-soft pt-3 mt-4 flex justify-between text-[10px] font-mono text-muted">
              <span>{institutesCount} Institutes</span>
            </div>
          </div>

          {/* Phase 2: Roster */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors">
            <div>
              <span className="text-[9px] text-muted font-mono uppercase block">Stage 2. Roster</span>
              <h3 className="text-2xl font-bold text-ink mt-2">{seafarersCount}</h3>
              <p className="text-xxs text-muted mt-1">Total registered students</p>
            </div>
            <div className="border-t border-hairline-soft pt-3 mt-4 flex justify-between text-[10px] font-mono text-muted">
              <span>{enrolledStudents} Enrolled</span>
            </div>
          </div>

          {/* Phase 3: Placements */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors">
            <div>
              <span className="text-[9px] text-muted font-mono uppercase block">Stage 3. Berthing</span>
              <h3 className="text-2xl font-bold text-ink mt-2">{occupiedBerths}</h3>
              <p className="text-xxs text-muted mt-1">Vessel berths assigned</p>
            </div>
            <div className="border-t border-hairline-soft pt-3 mt-4 flex justify-between text-[10px] font-mono text-muted">
              <span>{totalBerths - occupiedBerths} Available</span>
            </div>
          </div>

          {/* Phase 4: Signed On */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors">
            <div>
              <span className="text-[9px] text-muted font-mono uppercase block">Stage 4. Signed On</span>
              <h3 className="text-2xl font-bold text-accent-teal mt-2">{onBoardCount}</h3>
              <p className="text-xxs text-muted mt-1">Candidates at sea</p>
            </div>
            <div className="border-t border-hairline-soft pt-3 mt-4 flex justify-between text-[10px] font-mono text-muted">
              <span>{pendingBoardingCount} Pending Board</span>
            </div>
          </div>

          {/* Phase 5: Signed Off */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors">
            <div>
              <span className="text-[9px] text-muted font-mono uppercase block">Stage 5. Completed</span>
              <h3 className="text-2xl font-bold text-success mt-2">{trainingCompletedCount}</h3>
              <p className="text-xxs text-muted mt-1">Sea service completed</p>
            </div>
            <div className="border-t border-hairline-soft pt-3 mt-4 flex justify-between text-[10px] font-mono text-muted">
              <span>{placementRate}% Placed</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Stage 1 Academics & Enrollments Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pre-Sea Academics Registry */}
        <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono">Stage 1 Deep-Dive</span>
                <h2 className="text-lg font-serif text-ink mt-0.5">Maritime Courses Registry</h2>
              </div>
              <span className="text-xxs bg-primary/10 text-primary font-mono px-2 py-0.5 rounded">
                {courseList.length} Displayed
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-hairline rounded" />
                <div className="h-6 bg-hairline rounded" />
                <div className="h-6 bg-hairline rounded" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-hairline-soft text-muted uppercase text-[9px] tracking-wider font-mono">
                      <th className="pb-2">Course Title</th>
                      <th className="pb-2">Institute</th>
                      <th className="pb-2">Start Date</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseList.length > 0 ? (
                      courseList.map(course => {
                        const instName = instituteNames.get(course.instituteId || "") || "External Institute";
                        return (
                          <tr key={course.id} className="border-b border-hairline-soft/40 hover:bg-canvas/30 transition-colors">
                            <td className="py-2.5 font-medium text-body-strong truncate max-w-[150px]">{course.name}</td>
                            <td className="py-2.5 text-muted truncate max-w-[120px]">{instName}</td>
                            <td className="py-2.5 text-muted font-mono">{course.startDate}</td>
                            <td className="py-2.5 text-right">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded font-mono ${
                                course.isActive ? "bg-success/10 text-success" : "bg-surface-soft text-muted"
                              }`}>
                                {course.isActive ? "Active" : "Closed"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-muted italic">No active courses registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Student Recruitment & Graduation Funnel */}
        <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono">Stage 2 Deep-Dive</span>
                <h2 className="text-lg font-serif text-ink mt-0.5">Recruitment Completion Funnel</h2>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-accent-teal">{studentCompletionRate}%</span>
                <p className="text-[9px] text-muted font-mono">Graduation Rate</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-hairline rounded" />
                <div className="h-12 bg-hairline rounded" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Visual stacked gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Funnel Split Ratio</span>
                    <span className="text-muted">{seafarersCount} Candidates</span>
                  </div>
                  <div className="w-full bg-surface-soft h-3 rounded-full flex overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${seafarersCount > 0 ? (enrolledStudents/seafarersCount)*100 : 33}%` }} title="In Training" />
                    <div className="bg-accent-teal h-full transition-all duration-500" style={{ width: `${seafarersCount > 0 ? (completedStudents/seafarersCount)*100 : 33}%` }} title="Completed" />
                    <div className="bg-muted-soft h-full transition-all duration-500" style={{ width: `${seafarersCount > 0 ? (cancelledStudents/seafarersCount)*100 : 34}%` }} title="Left / Terminated" />
                  </div>
                  <div className="flex justify-between text-[9px] text-muted font-mono">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> In-Training ({enrolledStudents})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent-teal rounded-full" /> Completed ({completedStudents})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-muted-soft rounded-full" /> Terminated ({cancelledStudents})</span>
                  </div>
                </div>

                <div className="bg-canvas border border-hairline-soft rounded-xl p-4 text-xs leading-relaxed text-body-text">
                  Once candidates complete their pre-sea courses, they become eligible for sea service training and can be assigned to berths registered by shipping companies.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Stage 2 Fleet & Berth Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Companies & Fleet Registry */}
        <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-muted uppercase font-mono">Stage 3 Deep-Dive</span>
                <h2 className="text-lg font-serif text-ink mt-0.5">Vessel Fleet Registry</h2>
              </div>
              <span className="text-xxs bg-muted-soft/10 text-muted px-2 py-0.5 rounded font-mono">
                {vesselsCount} Registered
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-hairline rounded" />
                <div className="h-6 bg-hairline rounded" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-hairline-soft text-muted uppercase text-[9px] tracking-wider font-mono">
                      <th className="pb-2">Vessel Name</th>
                      <th className="pb-2">IMO Number</th>
                      <th className="pb-2">Flag Register</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vesselList.length > 0 ? (
                      vesselList.map(vessel => (
                        <tr key={vessel.id} className="border-b border-hairline-soft/40 hover:bg-canvas/30 transition-colors">
                          <td className="py-2.5 font-medium text-body-strong">{vessel.name}</td>
                          <td className="py-2.5 text-muted font-mono">{vessel.imo}</td>
                          <td className="py-2.5 text-muted font-mono">{vessel.flag}</td>
                          <td className="py-2.5 text-right">
                            <span className={`w-2 h-2 rounded-full inline-block ${
                              vessel.isActive ? "bg-success" : "bg-muted-soft"
                            }`} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-muted italic">No vessels registered in the fleet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Vessel Berth Occupancy Ledger */}
        <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-muted uppercase font-mono">Berth Allocation</span>
                <h2 className="text-lg font-serif text-ink mt-0.5">Vessel Berth Assignments</h2>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-primary">{berthUtilization}%</span>
                <p className="text-[9px] text-muted font-mono">Capacity Occupied</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-hairline rounded" />
                <div className="h-6 bg-hairline rounded" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-hairline-soft text-muted uppercase text-[9px] tracking-wider font-mono">
                      <th className="pb-2">Berth Slot</th>
                      <th className="pb-2">Assigned Vessel</th>
                      <th className="pb-2">Start Date</th>
                      <th className="pb-2 text-right">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocationsList.length > 0 ? (
                      allocationsList.map(alloc => {
                        const bName = berthNames.get(alloc.berthId) || "Berth Slot";
                        const vName = vesselNames.get(alloc.vesselId) || "Vessel";
                        return (
                          <tr key={alloc.id} className="border-b border-hairline-soft/40 hover:bg-canvas/30 transition-colors">
                            <td className="py-2.5 font-medium text-body-strong font-mono">{bName}</td>
                            <td className="py-2.5 text-accent-teal font-semibold font-sans">{vName}</td>
                            <td className="py-2.5 text-muted font-mono">{alloc.startDate}</td>
                            <td className="py-2.5 text-muted font-mono text-right">{alloc.endDate}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-muted italic">No active berth assignments.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: Stage 3 Sea Service Training & Boarding Contracts (Full Width Ledger) */}
      <div className="bg-surface-card border border-hairline-soft rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 border-b border-hairline-soft pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono">Stage 5 Placements Ledger</span>
            <h2 className="text-lg font-serif text-ink mt-0.5">Sea-Service Training Boarding Contracts</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-canvas border border-hairline-soft rounded-lg px-3 py-1.5 text-center text-xs font-mono">
              <span className="text-muted block text-[9px] uppercase">Currently at Sea</span>
              <span className="font-bold text-accent-teal block mt-0.5">{onBoardCount}</span>
            </div>
            <div className="bg-canvas border border-hairline-soft rounded-lg px-3 py-1.5 text-center text-xs font-mono">
              <span className="text-muted block text-[9px] uppercase">Graduated</span>
              <span className="font-bold text-success block mt-0.5">{trainingCompletedCount}</span>
            </div>
            <div className="bg-canvas border border-hairline-soft rounded-lg px-3 py-1.5 text-center text-xs font-mono">
              <span className="text-muted block text-[9px] uppercase">Placement rate</span>
              <span className="font-bold text-primary block mt-0.5">{placementRate}%</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-hairline rounded" />
            <div className="h-6 bg-hairline rounded" />
            <div className="h-6 bg-hairline rounded" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-hairline-soft text-muted uppercase text-[9px] tracking-wider font-mono">
                  <th className="pb-2">Candidate Name</th>
                  <th className="pb-2">Shipping Company</th>
                  <th className="pb-2">Sign-On Event</th>
                  <th className="pb-2">Sign-Off Event</th>
                  <th className="pb-2 text-right">Contract Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContracts.length > 0 ? (
                  recentContracts.map(c => {
                    const name = seafarerNames.get(c.indosMasterId) || "Candidate";
                    const companyName = companyNames.get(c.companyId) || "Shipping Co.";
                    
                    const signOn = c.actualSignOnDate 
                      ? `${c.actualSignOnDate} (${c.actualSignOnPort || c.signOnPort})` 
                      : `Est: ${c.signOnDate} (${c.signOnPort})`;
                    
                    const signOff = c.actualSignOffDate 
                      ? `${c.actualSignOffDate} (${c.actualSignOffPort || c.signOffPort})` 
                      : c.actualSignOnDate 
                        ? "Currently On Board" 
                        : `Est: ${c.signOffDate} (${c.signOffPort})`;
                    
                    let statusLabel = "Draft Setup";
                    let statusClass = "text-muted bg-surface-soft";
                    if (c.actualSignOnDate && !c.actualSignOffDate) {
                      statusLabel = "Signed On (At Sea)";
                      statusClass = "text-accent-teal bg-accent-teal/10 border border-accent-teal/20";
                    } else if (c.actualSignOnDate && c.actualSignOffDate) {
                      statusLabel = "Signed Off (Graduated)";
                      statusClass = "text-success bg-success/10 border border-success/20";
                    }

                    return (
                      <tr key={c.id} className="border-b border-hairline-soft/40 hover:bg-canvas/30 transition-colors">
                        <td className="py-3 font-semibold text-body-strong">{name}</td>
                        <td className="py-3 text-muted">{companyName}</td>
                        <td className="py-3 text-muted font-mono">{signOn}</td>
                        <td className="py-3 text-muted font-mono">{signOff}</td>
                        <td className="py-3 text-right">
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted italic">No sea service placements found in ledger.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 5: Live Database Operations Audit Log Console (Full Width Terminal) */}
      <div className="bg-surface-dark border border-surface-dark-elevated rounded-2xl p-6 font-mono text-[10px] text-on-dark-soft">
        <div className="flex justify-between items-center mb-4 border-b border-surface-dark-elevated pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xs font-bold text-on-dark font-sans tracking-wide uppercase">System Audit Log Console</h2>
          </div>
          <span className="text-[9px] text-on-dark-soft/40">Audit Logging Enabled</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse py-4">
            <div className="h-3 bg-surface-dark-elevated rounded w-3/4" />
            <div className="h-3 bg-surface-dark-elevated rounded w-2/3" />
            <div className="h-3 bg-surface-dark-elevated rounded w-5/6" />
          </div>
        ) : (
          <div className="space-y-3.5 my-2">
            {auditLogs.length > 0 ? (
              auditLogs.map(log => {
                const date = new Date(log.changedAt);
                const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                return (
                  <div key={log.id} className="border-b border-surface-dark-elevated/40 pb-3 last:border-b-0">
                    <div className="flex justify-between items-center text-[9px] text-on-dark-soft/50">
                      <span>[{timeStr}] OP: {log.operation}</span>
                      <span className="bg-surface-dark-elevated px-1.5 py-0.5 rounded text-[8px] tracking-widest">{log.tableName}</span>
                    </div>
                    <p className="text-on-dark truncate mt-1">
                      RECORD_ID: {log.recordId} {"->"} VALUES: {log.newValues || log.oldValues || "N/A"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-on-dark-soft/50 italic text-center py-6">No audit records found in log stream.</p>
            )}
          </div>
        )}

        <div className="border-t border-surface-dark-elevated pt-3 mt-4 flex justify-between items-center text-[9px] text-on-dark-soft/30 font-sans">
          <span>Active Connections: 1 Client Console</span>
          <span>Security Compliance: Verified</span>
        </div>
      </div>

    </div>
  );
}
