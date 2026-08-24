"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getIndosByIndos,
  getAllRanks,
  deleteIndos,
  getEnrollmentsByIndosId,
  getAllCourses,
  getContractsByIndosId,
  getAllCompanies,
  getAllInstitutes,
  createEnrollment,
  updateEnrollment,
  getAllBerthSeafarerAllocations,
  getAllBerthAllocations,
  getAllBerths,
  getAllVessels,
  updateContract,
  updateIndos,
  IndosMasterResponseDTO,
  RankMasterResponseDTO,
  EnrollmentResponseDTO,
  PreSeaCoursesResponseDTO,
  ContractResponseDTO,
  CompanyResponseDTO,
  InstituteResponseDTO,
  BerthSeafarerAllocationResponseDTO,
  BerthAllocationResponseDTO,
  BerthResponseDTO,
  VesselResponseDTO,
  toSlug
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  Pagination,
  LoadingSkeleton,
  EmptyState,
  Modal,
  ConfirmDialog,
  StatusBadge,
  InfoRow,
  useToast
} from "@/components/ui";

type DetailTab = "overview" | "courses" | "addCourses" | "training";

export default function SeafarerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const indos = params.indos as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core entities
  const [seafarer, setSeafarer] = useState<IndosMasterResponseDTO | null>(null);
  const [ranks, setRanks] = useState<RankMasterResponseDTO[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [contracts, setContracts] = useState<ContractResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [institutes, setInstitutes] = useState<InstituteResponseDTO[]>([]);

  // Operational mappings for resolving contract details
  const [berthSeafarerAllocations, setBerthSeafarerAllocations] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  const [berthAllocations, setBerthAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);

  // Navigation tab
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("overview");

  // Edit profile states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: "",
    rankId: "",
    isActive: true
  });

  // Enroll states
  const [enrollingCourse, setEnrollingCourse] = useState<PreSeaCoursesResponseDTO | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  // Sign On / Sign Off modal states
  const [activeActionContract, setActiveActionContract] = useState<ContractResponseDTO | null>(null);
  const [actionType, setActionType] = useState<"signon" | "signoff" | null>(null);
  const [actionForm, setActionForm] = useState({
    date: new Date().toISOString().split("T")[0],
    port: "",
    country: ""
  });

  // Search & Filter
  const [instituteSearch, setInstituteSearch] = useState("");
  const [selectedInstIds, setSelectedInstIds] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const loadSeafarerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveSeafarer, liveRanks] = await Promise.all([
        getIndosByIndos(indos),
        getAllRanks()
      ]);
      setSeafarer(liveSeafarer);
      setRanks(liveRanks);
      setEditProfileForm({
        firstName: liveSeafarer.firstName,
        rankId: liveSeafarer.rankId,
        isActive: liveSeafarer.isActive
      });

      const seafarerId = liveSeafarer.id;
      const [
        seafarerEnrollments,
        allCourses,
        seafarerContracts,
        allCompanies,
        allInstitutes,
        allBSAllocations,
        allBAllocations,
        allBerths,
        allVessels
      ] = await Promise.all([
        getEnrollmentsByIndosId(seafarerId),
        getAllCourses(),
        getContractsByIndosId(seafarerId),
        getAllCompanies(),
        getAllInstitutes(),
        getAllBerthSeafarerAllocations(),
        getAllBerthAllocations(),
        getAllBerths(),
        getAllVessels()
      ]);

      setEnrollments(seafarerEnrollments);
      setCourses(allCourses);
      setContracts(seafarerContracts);
      setCompanies(allCompanies);
      setInstitutes(allInstitutes);
      setBerthSeafarerAllocations(allBSAllocations);
      setBerthAllocations(allBAllocations);
      setBerths(allBerths);
      setVessels(allVessels);
    } catch (err: any) {
      console.error("Failed to load seafarer registry data", err);
      setError("Failed to query seafarer records from backend registries.");
      toast("Error loading seafarer details", "error");
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

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seafarer) return;

    if (!editProfileForm.firstName.trim()) {
      toast("First name cannot be empty.", "warning");
      return;
    }
    if (!editProfileForm.rankId) {
      toast("Please select a rank.", "warning");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateIndos(seafarer.id, {
        indos: seafarer.indos,
        firstName: editProfileForm.firstName.trim(),
        rankId: editProfileForm.rankId,
        isActive: editProfileForm.isActive
      });
      setSeafarer(updated);
      toast("Profile updated successfully.", "success");
      setIsEditProfileOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSeafarer = async () => {
    if (!seafarer) return;
    try {
      await deleteIndos(seafarer.id);
      toast("Seafarer record deleted successfully.", "success");
      router.push("/seafarer");
    } catch (err: any) {
      toast(err.message || "Failed to delete seafarer registry entry.", "error");
    }
  };

  const handleConfirmEnroll = async () => {
    if (!enrollingCourse || !seafarer) return;
    setEnrolling(true);
    try {
      await createEnrollment({
        preSeaCourseId: enrollingCourse.id,
        indosMasterId: seafarer.id,
        status: "ENROLLED"
      });
      toast("Enrolled in course successfully.", "success");
      const updatedEnrollments = await getEnrollmentsByIndosId(seafarer.id);
      setEnrollments(updatedEnrollments);
      setEnrollingCourse(null);
    } catch (err: any) {
      toast(err.message || "Failed to enroll in program.", "error");
    } finally {
      setEnrolling(false);
    }
  };

  const handleStatusChange = async (enrollmentId: string, status: "COMPLETED" | "CANCELLED") => {
    if (!seafarer) return;
    try {
      const found = enrollments.find(e => e.id === enrollmentId);
      if (!found) return;

      await updateEnrollment(enrollmentId, {
        preSeaCourseId: found.preSeaCourseId,
        indosMasterId: found.indosMasterId,
        status,
        remarks: found.remarks
      });
      toast(`Enrollment updated to ${status}.`, "success");
      const updated = await getEnrollmentsByIndosId(seafarer.id);
      setEnrollments(updated);
    } catch (err: any) {
      toast(err.message || "Failed to update enrollment status.", "error");
    }
  };

  const handleContractActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionContract || !actionType) return;

    if (!actionForm.port.trim() || !actionForm.country.trim()) {
      toast("Port and country are required.", "warning");
      return;
    }

    try {
      const updatedPayload = { ...activeActionContract };
      if (actionType === "signon") {
        updatedPayload.actualSignOnDate = actionForm.date + "T00:00:00Z";
        updatedPayload.actualSignOnPort = actionForm.port.trim();
        updatedPayload.actualSignOnCountry = actionForm.country.trim();
        updatedPayload.status = "ACTIVE";
      } else {
        updatedPayload.actualSignOffDate = actionForm.date + "T00:00:00Z";
        updatedPayload.actualSignOffPort = actionForm.port.trim();
        updatedPayload.actualSignOffCountry = actionForm.country.trim();
        updatedPayload.status = "COMPLETED";
      }

      await updateContract(activeActionContract.id, updatedPayload);
      toast(actionType === "signon" ? "Sign-On recorded." : "Sign-Off recorded.", "success");
      if (seafarer) {
        const updatedContracts = await getContractsByIndosId(seafarer.id);
        setContracts(updatedContracts);
      }
      setActiveActionContract(null);
      setActionType(null);
    } catch (err: any) {
      toast(err.message || "Failed to log contract event.", "error");
    }
  };

  const getContractDetails = (contract: ContractResponseDTO) => {
    const companyName = companies.find(c => c.id === contract.companyId)?.name ?? "Unknown Carrier";

    // Resolve Vessel and Berth Name from Allocations
    const bsAlloc = berthSeafarerAllocations.find(a => a.id === contract.berthSeafarerAllocationId);
    let vesselName = "Unknown Vessel";
    let berthName = "Unknown Berth";

    if (bsAlloc) {
      const bAlloc = berthAllocations.find(a => a.id === bsAlloc.berthAllocationId);
      if (bAlloc) {
        const v = vessels.find(x => x.id === bAlloc.vesselId);
        if (v) vesselName = v.name;
      }
      const b = berths.find(x => x.id === bsAlloc.berthId);
      if (b) berthName = b.berthName;
    }

    return { companyName, vesselName, berthName };
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !seafarer) {
    return (
      <EmptyState
        message={error || "Seafarer details could not be resolved."}
        title="Candidate Profile Error"
        ctaLabel="Back to Registry"
        onCtaClick={() => router.push("/seafarer")}
      />
    );
  }

  return (
    <>
      <PublicLayoutHeader deps={[seafarer.id, seafarer.firstName, seafarer.isActive]}>
        <PageHeader
          title={seafarer.firstName}
          subtitle={`INDOS No: ${seafarer.indos} | ${getRankName(seafarer.rankId)}`}
          backHref="/seafarer"
          backLabel="Back to Registry"
        >
          <StatusBadge status={seafarer.isActive ? "true" : "false"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeDetailTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 font-sans">
            {(
              [
                { id: "overview", label: "Overview" },
                { id: "courses", label: "Registered Courses" },
                { id: "addCourses", label: "Enroll in Courses" },
                { id: "training", label: "Sea Training Contracts" }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                  activeDetailTab === tab.id
                    ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                    : "text-muted hover:text-ink hover:bg-surface-soft/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        {/* Overview Tab */}
        {activeDetailTab === "overview" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-serif text-ink mb-1">Audit Profile Record</h3>
              <p className="text-xs text-muted">Registry details and compliance status markers.</p>
            </div>

            <div className="flex flex-col border border-hairline rounded-lg p-4 bg-canvas">
              <InfoRow label="INDOS Registry ID" value={seafarer.indos} />
              <InfoRow label="Full Audited Name" value={seafarer.firstName} />
              <InfoRow label="Active Deck Rank" value={getRankName(seafarer.rankId)} />
              <InfoRow label="Compliance Status" value={<StatusBadge status={seafarer.isActive ? "true" : "false"} />} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="h-10 px-4 bg-error/10 text-error font-medium rounded-md hover:bg-error/20 border border-error/20 inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                Delete Profile
              </button>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                Edit Profile details
              </button>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeDetailTab === "courses" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-serif text-ink mb-1">Registered Courses</h3>
              <p className="text-xs text-muted">Audited certification compliance under standard pre-sea training registers.</p>
            </div>

            {enrollments.length === 0 ? (
              <EmptyState message="This candidate is not enrolled in any pre-sea course programs." title="No Enrolled Programs" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Course Program</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                      <th className="px-4 py-3 text-right font-semibold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {enrollments.map((e) => {
                      const cObj = courses.find((x) => x.id === e.preSeaCourseId);
                      return (
                        <tr key={e.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-body-strong">{cObj?.name ?? "Unknown"}</span>
                              <span className="text-[10px] text-muted">Start: {cObj?.startDate}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={e.status} />
                          </td>
                          <td className="px-4 py-3.5 text-right flex items-center justify-end gap-2">
                            {e.status === "ENROLLED" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(e.id, "COMPLETED")}
                                  className="px-2.5 py-1 bg-success/10 hover:bg-success/20 text-success rounded text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleStatusChange(e.id, "CANCELLED")}
                                  className="px-2.5 py-1 bg-error/10 hover:bg-error/20 text-error rounded text-[10px] font-bold uppercase cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
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

        {/* Add Courses Tab */}
        {activeDetailTab === "addCourses" && (
          <div className="flex flex-col gap-6 p-2 bg-canvas">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <SearchBar
                  placeholder="Search institutes..."
                  value={instituteSearch}
                  onChange={setInstituteSearch}
                />
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-hairline rounded-lg">
                  <table className="w-full border-collapse bg-surface-card text-xs">
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline text-muted">
                        <th className="px-4 py-3 text-left font-semibold uppercase w-10">Select</th>
                        <th className="px-4 py-3 text-left font-semibold uppercase">Institute</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft">
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
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <SearchBar
                  placeholder="Search course listings by name..."
                  value={courseSearch}
                  onChange={setCourseSearch}
                />
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-hairline rounded-lg">
                  <table className="w-full border-collapse bg-surface-card text-xs">
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline text-muted">
                        <th className="px-4 py-3 text-left font-semibold uppercase">Course Program</th>
                        <th className="px-4 py-3 text-left font-semibold uppercase">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline-soft">
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
                              onClick={() => !isEnrolled && setEnrollingCourse(c)}
                              className={`transition-colors ${isEnrolled ? "opacity-60 bg-surface-soft/20 cursor-not-allowed" : "hover:bg-surface-soft/20 cursor-pointer"}`}
                            >
                              <td className="px-4 py-3.5 text-body-strong font-semibold">
                                <div className="flex items-center gap-2">
                                  <span>{c.name}</span>
                                  {isEnrolled && <StatusBadge status="COMPLETED" />}
                                </div>
                                <span className="text-[10px] text-muted block font-normal mt-0.5">{instName}</span>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-muted">{c.startDate}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sea Training Contracts */}
        {activeDetailTab === "training" && (
          <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-serif text-ink mb-1">Sea Training Contracts</h3>
              <p className="text-xs text-muted">Overview of training berths and sign-on/off contracts.</p>
            </div>

            {contracts.length === 0 ? (
              <EmptyState message="No active or past sea service training berths contracts registered for this candidate." title="No Active Contracts" />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {contracts.map((c) => {
                  const { companyName, vesselName, berthName } = getContractDetails(c);
                  return (
                    <div key={c.id} className="border border-hairline bg-canvas rounded-xl p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-ink">{companyName}</span>
                          <span className="text-[10px] text-muted-soft uppercase tracking-wider font-semibold font-mono">{vesselName} — {berthName}</span>
                        </div>
                        <StatusBadge status={c.status || "DRAFT"} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-muted text-[10px] uppercase">Planned Schedule</span>
                          <div className="flex flex-col gap-0.5">
                            <span>Sign-On: <strong>{c.signOnDate.split("T")[0]}</strong> at {c.signOnPort}, {c.signOnCountry}</span>
                            <span>Sign-Off: <strong>{c.signOffDate.split("T")[0]}</strong> at {c.signOffPort}, {c.signOffCountry}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-hairline pt-3.5 md:pt-0 md:pl-4">
                          <span className="font-semibold text-muted text-[10px] uppercase">Actual Log</span>
                          <div className="flex flex-col gap-0.5">
                            <span>
                              Sign-On:{" "}
                              {c.actualSignOnDate ? (
                                <strong>
                                  {c.actualSignOnDate.split("T")[0]} ({c.actualSignOnPort})
                                </strong>
                              ) : (
                                <span className="text-muted italic">Not signed on yet</span>
                              )}
                            </span>
                            <span>
                              Sign-Off:{" "}
                              {c.actualSignOffDate ? (
                                <strong>
                                  {c.actualSignOffDate.split("T")[0]} ({c.actualSignOffPort})
                                </strong>
                              ) : (
                                <span className="text-muted italic">Not signed off yet</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {c.status !== "COMPLETED" && c.status !== "TERMINATED" && (
                        <div className="flex justify-end gap-2 border-t border-hairline-soft pt-3 mt-2">
                          {!c.actualSignOnDate && (
                            <button
                              onClick={() => {
                                setActiveActionContract(c);
                                setActionType("signon");
                                setActionForm({
                                  date: new Date().toISOString().split("T")[0],
                                  port: c.signOnPort,
                                  country: c.signOnCountry
                                });
                              }}
                              className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-[10px] font-bold uppercase transition-colors hover:bg-primary-active cursor-pointer"
                            >
                              Record Sign-On
                            </button>
                          )}
                          {c.actualSignOnDate && !c.actualSignOffDate && (
                            <button
                              onClick={() => {
                                setActiveActionContract(c);
                                setActionType("signoff");
                                setActionForm({
                                  date: new Date().toISOString().split("T")[0],
                                  port: c.signOffPort,
                                  country: c.signOffCountry
                                });
                              }}
                              className="px-3.5 py-1.5 bg-success text-on-primary rounded text-[10px] font-bold uppercase transition-colors hover:bg-success/90 cursor-pointer"
                            >
                              Record Sign-Off
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile details"
        subtitle="Modify profile registry details."
      >
        <form onSubmit={handleEditProfile} className="flex flex-col gap-4 font-sans text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">FULL NAME</label>
            <input
              type="text"
              value={editProfileForm.firstName}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, firstName: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">DECK RANK</label>
            <select
              value={editProfileForm.rankId}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, rankId: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            >
              {ranks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="edit-isActive"
              checked={editProfileForm.isActive}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="edit-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE ELIGIBILITY STATUS
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Enroll Modal */}
      {enrollingCourse && (
        <Modal
          isOpen={true}
          onClose={() => setEnrollingCourse(null)}
          title="Enroll in Course Program"
          subtitle="Confirm enrollment status."
        >
          <div className="flex flex-col gap-4 font-sans text-xs">
            <div className="flex flex-col gap-3">
              <InfoRow label="Course Name" value={enrollingCourse.name} />
              <InfoRow
                label="Institute Partner"
                value={institutes.find(i => i.id === enrollingCourse.instituteId)?.name ?? "Unknown"}
              />
              <InfoRow label="Start Date" value={enrollingCourse.startDate} />
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
              <button
                onClick={() => setEnrollingCourse(null)}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnroll}
                disabled={enrolling}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
              >
                {enrolling ? "Enrolling..." : "Confirm Enrollment"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Sign On / Sign Off Modal */}
      {activeActionContract && actionType && (
        <Modal
          isOpen={true}
          onClose={() => {
            setActiveActionContract(null);
            setActionType(null);
          }}
          title={actionType === "signon" ? "Log actual Sign-On Event" : "Log actual Sign-Off Event"}
          subtitle="Enter sign event coordinates."
        >
          <form onSubmit={handleContractActionSubmit} className="flex flex-col gap-4 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">EVENT DATE</label>
              <input
                type="date"
                value={actionForm.date}
                onChange={(e) => setActionForm({ ...actionForm, date: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">PORT CITY</label>
              <input
                type="text"
                placeholder="e.g. Port of Mumbai"
                value={actionForm.port}
                onChange={(e) => setActionForm({ ...actionForm, port: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">PORT COUNTRY</label>
              <input
                type="text"
                placeholder="e.g. India"
                value={actionForm.country}
                onChange={(e) => setActionForm({ ...actionForm, country: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveActionContract(null);
                  setActionType(null);
                }}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer font-semibold"
              >
                Submit Event Log
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteSeafarer}
        title="Confirm profile Deletion"
        message="Are you sure you want to delete this candidate registry profile? This will remove all associated enrollment and sea training contracts history."
        confirmLabel="Delete permanently"
        isDestructive={true}
      />
    </>
  );
}
