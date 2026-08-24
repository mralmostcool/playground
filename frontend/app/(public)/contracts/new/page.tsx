"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getAllIndos,
  getEnrollmentsByIndosId,
  getAllCourses,
  getAllCompanies,
  getAllVessels,
  getAllBerthAllocations,
  getAllBerths,
  createBerthSeafarerAllocation,
  createContract,
  IndosMasterResponseDTO,
  EnrollmentResponseDTO,
  PreSeaCoursesResponseDTO,
  CompanyResponseDTO,
  VesselResponseDTO,
  BerthAllocationResponseDTO,
  BerthResponseDTO,
  getVesselCompanyId
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  useToast
} from "@/components/ui";

function NewContractWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Steps: 1 (Seafarer/Enrollment), 2 (Company/Vessel), 3 (Berth/Allocation), 4 (Contract Terms)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Collections
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [berthAllocations, setBerthAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);

  // Selection state
  const [selectedSeafarer, setSelectedSeafarer] = useState<IndosMasterResponseDTO | null>(null);
  const [seafarerEnrollments, setSeafarerEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentResponseDTO | null>(null);
  
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<VesselResponseDTO | null>(null);
  
  const [selectedAllocation, setSelectedAllocation] = useState<BerthAllocationResponseDTO | null>(null);

  // Form State
  const [form, setForm] = useState({
    signOnPort: "",
    signOnCountry: "",
    signOffPort: "",
    signOffCountry: "",
    startDate: "",
    endDate: "",
    remarks: ""
  });

  const [saving, setSaving] = useState(false);

  // Search filter strings
  const [seafarerSearch, setSeafarerSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [allSeafarers, allCourses, allComps, allVessels, allBerths, allAllocs] = await Promise.all([
        getAllIndos(),
        getAllCourses(),
        getAllCompanies(),
        getAllVessels(),
        getAllBerths(),
        getAllBerthAllocations()
      ]);
      
      setSeafarers(allSeafarers);
      setCourses(allCourses);
      setCompanies(allComps);
      setVessels(allVessels);
      setBerths(allBerths);
      setBerthAllocations(allAllocs);

      // Pre-select seafarer if indos query parameter is provided
      const preIndos = searchParams.get("indos");
      if (preIndos) {
        const found = allSeafarers.find(s => s.indos === preIndos);
        if (found) {
          setSelectedSeafarer(found);
          const enrolls = await getEnrollmentsByIndosId(found.id);
          setSeafarerEnrollments(enrolls);
        }
      }
    } catch (err: any) {
      toast("Failed to load setup registers.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSeafarerSelect = async (s: IndosMasterResponseDTO) => {
    setSelectedSeafarer(s);
    setSelectedEnrollment(null);
    setLoading(true);
    try {
      const enrolls = await getEnrollmentsByIndosId(s.id);
      setSeafarerEnrollments(enrolls);
    } catch (err) {
      toast("Failed to query enrollments for this seafarer.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedSeafarer) {
        toast("Please select a seafarer.", "warning");
        return;
      }
      if (!selectedEnrollment) {
        toast("Please select an active pre-sea course enrollment.", "warning");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedCompany) {
        toast("Please select a shipping company.", "warning");
        return;
      }
      if (!selectedVessel) {
        toast("Please select an active vessel.", "warning");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedAllocation) {
        toast("Please select an active berth allocation.", "warning");
        return;
      }
      // Populate contract default dates from berth allocation window
      setForm(prev => ({
        ...prev,
        startDate: selectedAllocation.startDate.split("T")[0],
        endDate: selectedAllocation.endDate.split("T")[0]
      }));
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeafarer || !selectedCompany || !selectedEnrollment || !selectedAllocation) return;

    if (!form.signOnPort.trim() || !form.signOnCountry.trim() || !form.signOffPort.trim() || !form.signOffCountry.trim()) {
      toast("Please fill in all sign-on/sign-off ports and countries.", "warning");
      return;
    }

    setSaving(true);
    try {
      // 1. Create Berth Seafarer Allocation
      const bsAlloc = await createBerthSeafarerAllocation({
        berthId: selectedAllocation.berthId,
        indosMasterId: selectedSeafarer.id,
        berthAllocationId: selectedAllocation.id,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString()
      });

      // 2. Create Training Contract
      const contract = await createContract({
        indosMasterId: selectedSeafarer.id,
        companyId: selectedCompany.id,
        enrollmentId: selectedEnrollment.id,
        berthSeafarerAllocationId: bsAlloc.id,
        status: "DRAFT",
        signOnDate: new Date(form.startDate).toISOString(),
        signOnPort: form.signOnPort.trim(),
        signOnCountry: form.signOnCountry.trim(),
        signOffDate: new Date(form.endDate).toISOString(),
        signOffPort: form.signOffPort.trim(),
        signOffCountry: form.signOffCountry.trim(),
        remarks: form.remarks.trim() || undefined
      });

      toast("Contract registered successfully!", "success");
      router.push(`/seafarer/${selectedSeafarer.indos}`);
    } catch (err: any) {
      toast(err.message || "Failed to create training contract.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filtered views
  const filteredSeafarers = seafarers.filter(s =>
    s.firstName.toLowerCase().includes(seafarerSearch.toLowerCase()) ||
    s.indos.toLowerCase().includes(seafarerSearch.toLowerCase())
  );

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const companyVessels = vessels.filter(v =>
    getVesselCompanyId(v.id, v.name, companies) === selectedCompany?.id
  );

  const vesselAllocationsFiltered = berthAllocations.filter(a =>
    a.vesselId === selectedVessel?.id
  );

  const getCourseName = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.name ?? "Unknown Course";
  };

  const getBerthName = (berthId: string) => {
    return berths.find(b => b.id === berthId)?.berthName ?? "Unknown Berth";
  };

  if (loading && step === 1 && seafarers.length === 0) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  return (
    <>
      <PublicLayoutHeader>
        <PageHeader
          title="New Sea Contract Wizard"
          subtitle="Generate a shipboard training contract associating seafarer credentials with vessel berths."
          backHref="/seafarer"
          backLabel="Cancel & Exit"
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[step]}>
        <div className="flex flex-col gap-6 mt-4 font-sans text-xs text-muted leading-relaxed">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h4 className="font-semibold text-body-strong">Contract Progress</h4>
            <div className="flex flex-col gap-3 font-mono">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary font-semibold" : ""}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step > 1 ? "bg-primary text-on-primary border-primary" : "border-muted"}`}>1</span>
                <span>Seafarer Registry</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary font-semibold" : ""}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step > 2 ? "bg-primary text-on-primary border-primary" : "border-muted"}`}>2</span>
                <span>Shipping Vessel</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary font-semibold" : ""}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step > 3 ? "bg-primary text-on-primary border-primary" : "border-muted"}`}>3</span>
                <span>Berth Allocation</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 4 ? "text-primary font-semibold" : ""}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step > 4 ? "bg-primary text-on-primary border-primary" : "border-muted"}`}>4</span>
                <span>Contract Terms</span>
              </div>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans text-xs">
        {/* Step 1: Seafarer Selection */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seafarer list */}
              <div className="flex flex-col gap-4">
                <h3 className="text-md font-serif text-ink">1. Choose Candidate Seafarer</h3>
                <SearchBar
                  placeholder="Search seafarers by name or INDOS ID..."
                  value={seafarerSearch}
                  onChange={setSeafarerSearch}
                />
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto border border-hairline rounded-lg bg-surface-card">
                  <table className="w-full border-collapse">
                    <tbody className="divide-y divide-hairline-soft">
                      {filteredSeafarers.map((s) => (
                        <tr
                          key={s.id}
                          onClick={() => handleSeafarerSelect(s)}
                          className={`cursor-pointer transition-colors ${selectedSeafarer?.id === s.id ? "bg-primary/10" : "hover:bg-surface-soft/20"}`}
                        >
                          <td className="px-4 py-3 font-semibold text-body-strong">{s.firstName}</td>
                          <td className="px-4 py-3 font-mono text-muted">{s.indos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enrollment list */}
              <div className="flex flex-col gap-4">
                <h3 className="text-md font-serif text-ink">2. Choose Active Course Enrollment</h3>
                {selectedSeafarer ? (
                  seafarerEnrollments.length === 0 ? (
                    <EmptyState message="No course enrollments detected for this seafarer. Register enrollment first." title="No Enrollments Found" />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {seafarerEnrollments.map((e) => (
                        <div
                          key={e.id}
                          onClick={() => setSelectedEnrollment(e)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedEnrollment?.id === e.id ? "border-primary bg-primary/5" : "border-hairline bg-surface-card hover:bg-canvas"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-body-strong">{getCourseName(e.preSeaCourseId)}</span>
                            <StatusBadge status={e.status} />
                          </div>
                          <span className="text-[10px] text-muted block">Enrolled Date: {e.createdAt.split("T")[0]}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-8 border border-dashed border-hairline rounded-xl text-center text-muted">
                    Select a seafarer first to load pre-sea course programs.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-hairline mt-6">
              <button
                onClick={handleNextStep}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center font-semibold cursor-pointer"
              >
                Proceed to Vessel Selection &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Shipping Company & Vessel */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shipping company list */}
              <div className="flex flex-col gap-4">
                <h3 className="text-md font-serif text-ink">3. Choose Shipping Company Carrier</h3>
                <SearchBar
                  placeholder="Search companies..."
                  value={companySearch}
                  onChange={setCompanySearch}
                />
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto border border-hairline rounded-lg bg-surface-card">
                  <table className="w-full border-collapse">
                    <tbody className="divide-y divide-hairline-soft">
                      {filteredCompanies.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => {
                            setSelectedCompany(c);
                            setSelectedVessel(null);
                          }}
                          className={`cursor-pointer transition-colors ${selectedCompany?.id === c.id ? "bg-primary/10" : "hover:bg-surface-soft/20"}`}
                        >
                          <td className="px-4 py-3 font-semibold text-body-strong">{c.name}</td>
                          <td className="px-4 py-3 font-mono text-muted">{c.registrationNo || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vessel list */}
              <div className="flex flex-col gap-4">
                <h3 className="text-md font-serif text-ink">4. Choose Active Vessel</h3>
                {selectedCompany ? (
                  companyVessels.length === 0 ? (
                    <EmptyState message="No fleet vessels registered for this company." title="No Vessels Registered" />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {companyVessels.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVessel(v)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedVessel?.id === v.id ? "border-primary bg-primary/5" : "border-hairline bg-surface-card hover:bg-canvas"}`}
                        >
                          <span className="font-semibold text-body-strong block">{v.name}</span>
                          <span className="text-[10px] text-muted font-mono block mt-1">IMO: {v.imo} | Flag: {v.flag}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-8 border border-dashed border-hairline rounded-xl text-center text-muted">
                    Select a shipping company first to load fleet vessels.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-hairline mt-6">
              <button
                onClick={() => setStep(1)}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                onClick={handleNextStep}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center font-semibold cursor-pointer"
              >
                Proceed to Berth Selection &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Berth Allocation Selection */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-md font-serif text-ink">5. Choose Active Berth Allocation Slot</h3>
            
            {selectedVessel ? (
              vesselAllocationsFiltered.length === 0 ? (
                <EmptyState
                  message="No active training berths are allocated to this vessel. Allocate a berth on the vessel details page first."
                  title="No Berths Allocated"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vesselAllocationsFiltered.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAllocation(a)}
                      className={`p-5 border rounded-xl cursor-pointer transition-all ${selectedAllocation?.id === a.id ? "border-primary bg-primary/5" : "border-hairline bg-surface-card hover:bg-canvas"}`}
                    >
                      <h4 className="font-serif text-md text-ink mb-2">{getBerthName(a.berthId)}</h4>
                      <div className="text-[11px] text-muted space-y-1">
                        <div>Start Date: <strong className="text-body-strong">{a.startDate.split("T")[0]}</strong></div>
                        <div>End Date: <strong className="text-body-strong">{a.endDate.split("T")[0]}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="p-8 border border-dashed border-hairline rounded-xl text-center text-muted">
                Vessel allocation setup required.
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-hairline mt-6">
              <button
                onClick={() => setStep(2)}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                onClick={handleNextStep}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center font-semibold cursor-pointer"
              >
                Proceed to Contract Details &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Contract Details form */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl mx-auto border border-hairline bg-surface-card p-6 rounded-xl">
            <h3 className="text-md font-serif text-ink border-b border-hairline pb-2">6. Enter Sea Service Contract Terms</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">PLANNED SIGN-ON DATE</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">PLANNED SIGN-OFF DATE</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">SIGN-ON PORT CITY</label>
                <input
                  type="text"
                  placeholder="e.g. Singapore Port"
                  value={form.signOnPort}
                  onChange={(e) => setForm({ ...form, signOnPort: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">SIGN-ON COUNTRY</label>
                <input
                  type="text"
                  placeholder="e.g. Singapore"
                  value={form.signOnCountry}
                  onChange={(e) => setForm({ ...form, signOnCountry: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">SIGN-OFF PORT CITY</label>
                <input
                  type="text"
                  placeholder="e.g. Port of Rotterdam"
                  value={form.signOffPort}
                  onChange={(e) => setForm({ ...form, signOffPort: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-body-strong">SIGN-OFF COUNTRY</label>
                <input
                  type="text"
                  placeholder="e.g. Netherlands"
                  value={form.signOffCountry}
                  onChange={(e) => setForm({ ...form, signOffCountry: e.target.value })}
                  className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                  style={{ height: "40px" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">REMARKS (OPTIONAL)</label>
              <textarea
                rows={3}
                placeholder="Remarks, terms, deck duties details..."
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full bg-canvas border border-muted focus:border-primary rounded-md outline-none p-3.5 text-sm"
              />
            </div>

            <div className="flex justify-between pt-6 border-t border-hairline mt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center font-semibold cursor-pointer disabled:opacity-50"
              >
                {saving ? "Registering Contract..." : "Register Sea Service Contract"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function NewContractWizardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} type="table" />}>
      <NewContractWizard />
    </Suspense>
  );
}
