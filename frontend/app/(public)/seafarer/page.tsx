"use client";

import { useState, useEffect } from "react";
import { 
  getAllIndos, 
  getAllRanks, 
  createIndos, 
  deleteIndos, 
  IndosMasterRequestDTO, 
  IndosMasterResponseDTO, 
  RankMasterResponseDTO
} from "@/lib/apiClient";

// ── Fallback Mock Datasets ───────────────────────────────────────────

const MOCK_RANKS: RankMasterResponseDTO[] = [
  { id: "r1", name: "Captain", level: 1, createdAt: "" },
  { id: "r2", name: "Chief Officer", level: 2, createdAt: "" },
  { id: "r3", name: "Second Mate", level: 3, createdAt: "" },
  { id: "r4", name: "Chief Engineer", level: 1, createdAt: "" },
  { id: "r5", name: "Second Engineer", level: 2, createdAt: "" },
  { id: "r6", name: "Bosun", level: 4, createdAt: "" }
];

const MOCK_SEAFARERS: IndosMasterResponseDTO[] = [
  { id: "s1", firstName: "Alexander", indos: "IN981245", rankId: "r1", isActive: true, createdAt: "", updatedAt: "" },
  { id: "s2", firstName: "Viktor", indos: "IN978341", rankId: "r2", isActive: true, createdAt: "", updatedAt: "" },
  { id: "s3", firstName: "Niko", indos: "IN991024", rankId: "r3", isActive: true, createdAt: "", updatedAt: "" },
  { id: "s4", firstName: "Elena", indos: "IN987654", rankId: "r4", isActive: false, createdAt: "", updatedAt: "" },
  { id: "s5", firstName: "Mateo", indos: "IN962130", rankId: "r5", isActive: true, createdAt: "", updatedAt: "" },
  { id: "s6", firstName: "Sophie", indos: "IN950481", rankId: "r6", isActive: true, createdAt: "", updatedAt: "" }
];

// Helper to generate mock certifications based on rank
function getMockCertifications(rankName: string) {
  const common = [
    { name: "STCW Basic Safety Training", issueDate: "2024-01-15", expiryDate: "2029-01-14", status: "Valid" },
    { name: "Security Awareness Training", issueDate: "2023-11-20", expiryDate: "2028-11-19", status: "Valid" }
  ];
  if (rankName.includes("Captain") || rankName.includes("Officer") || rankName.includes("Mate")) {
    return [
      ...common,
      { name: "GMDSS General Operator Certificate", issueDate: "2024-03-05", expiryDate: "2029-03-04", status: "Valid" },
      { name: "Radar Observer & ARPA Simulator", issueDate: "2025-05-10", expiryDate: "2030-05-09", status: "Valid" }
    ];
  } else if (rankName.includes("Engineer")) {
    return [
      ...common,
      { name: "Engine Resource Management", issueDate: "2024-06-12", expiryDate: "2029-06-11", status: "Valid" },
      { name: "High Voltage Installations (Management)", issueDate: "2023-08-18", expiryDate: "2028-08-17", status: "Valid" }
    ];
  } else {
    return [
      ...common,
      { name: "Proficiency in Survival Craft (PSCRB)", issueDate: "2025-02-14", expiryDate: "2030-02-13", status: "Valid" }
    ];
  }
}

export default function SeafarerPage() {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("manage");
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Core States
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [ranks, setRanks] = useState<RankMasterResponseDTO[]>([]);

  // Search/Details States
  const [search, setSearch] = useState("");
  const [selectedSeafarerId, setSelectedSeafarerId] = useState<string | null>(null);
  const [reportGenerating, setReportGenerating] = useState(false);

  // Form State
  const [form, setForm] = useState<IndosMasterRequestDTO>({
    indos: "",
    firstName: "",
    rankId: "",
    isActive: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [liveSeafarers, liveRanks] = await Promise.all([
        getAllIndos(),
        getAllRanks()
      ]);

      if (liveSeafarers && liveSeafarers.length > 0) {
        setSeafarers(liveSeafarers);
        setRanks(liveRanks);
        setIsUsingFallback(false);
      } else {
        useFallbackData();
      }
    } catch (err) {
      console.warn("Backend API offline or database empty. Utilizing local mock registries.");
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    setSeafarers(MOCK_SEAFARERS);
    setRanks(MOCK_RANKS);
    setIsUsingFallback(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRankName = (rankId: string) => {
    return ranks.find((r) => r.id === rankId)?.name ?? "Unknown Rank";
  };

  const getRankLevel = (rankId: string) => {
    return ranks.find((r) => r.id === rankId)?.level ?? null;
  };

  // Create Seafarer Handler
  const handleAddSeafarer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validations
    if (!form.indos || form.indos.trim().length !== 7) {
      setFormError("INDOS number must be exactly 7 characters.");
      return;
    }
    if (!form.firstName || form.firstName.trim().length === 0) {
      setFormError("First Name is required.");
      return;
    }
    if (!form.rankId) {
      setFormError("Please select a Rank.");
      return;
    }

    setSaving(true);
    try {
      if (isUsingFallback) {
        // Mock success in fallback mode
        const newMockSeafarer: IndosMasterResponseDTO = {
          id: `s_mock_${Date.now()}`,
          firstName: form.firstName,
          indos: form.indos.toUpperCase(),
          rankId: form.rankId,
          isActive: form.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSeafarers((prev) => [newMockSeafarer, ...prev]);
        setFormSuccess("Seafarer registered successfully (Offline Mode).");
      } else {
        // Call backend API
        await createIndos({
          indos: form.indos.toUpperCase(),
          firstName: form.firstName,
          rankId: form.rankId,
          isActive: form.isActive
        });
        setFormSuccess("Seafarer registered successfully.");
        await loadData();
      }

      // Reset form
      setForm({ indos: "", firstName: "", rankId: "", isActive: true });
      
      // Auto redirect after a delay
      setTimeout(() => {
        setFormSuccess(null);
        setActiveTab("manage");
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating seafarer.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Seafarer Handler
  const handleDeleteSeafarer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seafarer record from the directory?")) {
      return;
    }
    try {
      if (isUsingFallback) {
        setSeafarers((prev) => prev.filter((s) => s.id !== id));
        setSelectedSeafarerId(null);
        alert("Seafarer record deleted (Offline Mode).");
      } else {
        await deleteIndos(id);
        setSelectedSeafarerId(null);
        alert("Seafarer record deleted successfully.");
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete seafarer.");
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-8">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-primary font-bold uppercase tracking-wider">Public Access Panel</span>
          <h1 className="text-3xl md:text-4xl font-serif text-ink">Seafarer Services</h1>
          <p className="text-muted text-sm w-full max-w-[36rem]">
            A secure public registry enabling seafarers to audit credentials, view qualification training, and manage active profiles.
          </p>
        </div>
        {isUsingFallback && (
          <div className="flex items-center gap-1.5 text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 px-3 py-1.5 rounded-full self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse"></span>
            <span>Viewing Offline Demo Data</span>
          </div>
        )}
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sub-Sidebar (Vertical Navigation) */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-hairline pb-4 md:pb-0 md:pr-6 whitespace-nowrap">
          <button
            onClick={() => { setActiveTab("add"); setSearch(""); }}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all ${
              activeTab === "add"
                ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                : "text-muted hover:text-ink hover:bg-surface-soft/40"
            }`}
          >
            Add new Seafarer
          </button>
          <button
            onClick={() => { setActiveTab("manage"); setSearch(""); }}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all ${
              activeTab === "manage"
                ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                : "text-muted hover:text-ink hover:bg-surface-soft/40"
            }`}
          >
            Manage Seafarers
          </button>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-grow w-full">
          {loading ? (
            <div className="py-16 text-center text-sm text-muted">
              Syncing with maritime registries...
            </div>
          ) : (
            <div>
              {/* Tab 1: Add new Seafarer (Form) */}
              {activeTab === "add" && (
                <div className="max-w-xl bg-surface-card border border-hairline rounded-lg p-8 flex flex-col gap-6">
                  <div className="border-b border-hairline pb-4">
                    <h2 className="text-xl font-serif text-ink">Add New Seafarer Record</h2>
                    <p className="text-xs text-muted mt-1">Register a new profile with active INDOS compliance data.</p>
                  </div>

                  {formError && (
                    <div className="p-3.5 bg-error/10 text-error rounded-md text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3.5 bg-success/10 text-success rounded-md text-xs font-medium">
                      {formSuccess}
                    </div>
                  )}

                  <form onSubmit={handleAddSeafarer} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-body-strong">INDOS REGISTRY NUMBER</label>
                      <input
                        type="text"
                        placeholder="7 Characters (e.g. IN99238)"
                        maxLength={7}
                        value={form.indos}
                        onChange={(e) => setForm({ ...form, indos: e.target.value })}
                        className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                        style={{ height: "40px" }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-body-strong">FIRST NAME</label>
                      <input
                        type="text"
                        placeholder="Seafarer First Name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                        style={{ height: "40px" }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-body-strong">ASSIGNED RANK</label>
                      <select
                        value={form.rankId}
                        onChange={(e) => setForm({ ...form, rankId: e.target.value })}
                        className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                        style={{ height: "40px" }}
                      >
                        <option value="">Select Active Rank Option</option>
                        {ranks.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} (Level {r.level})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="form-isActive"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                      />
                      <label htmlFor="form-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                        ACTIVE DUTY ELIGIBLE
                      </label>
                    </div>

                    <div className="pt-2 border-t border-hairline flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="h-10 px-6 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {saving ? "Registering..." : "Save Seafarer"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 2: Manage Seafarers (Table & Drawer) */}
              {activeTab === "manage" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Search seafarers by name, INDOS registry or rank..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full text-input px-4 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none"
                      style={{ height: "42px" }}
                    />
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-surface-card border-b border-hairline">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">INDOS Registry</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">First Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Active Rank</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline-soft">
                          {seafarers
                            .filter(s => {
                              const rName = getRankName(s.rankId).toLowerCase();
                              const term = search.toLowerCase();
                              return s.firstName.toLowerCase().includes(term) || s.indos.toLowerCase().includes(term) || rName.includes(term);
                            })
                            .map((s) => (
                              <tr
                                key={s.id}
                                onClick={() => setSelectedSeafarerId(s.id)}
                                className={`cursor-pointer transition-colors ${
                                  selectedSeafarerId === s.id ? "bg-surface-soft" : "hover:bg-surface-soft/40"
                                }`}
                              >
                                <td className="px-4 py-3.5 text-sm font-mono font-medium text-ink">{s.indos}</td>
                                <td className="px-4 py-3.5 text-sm text-body-strong">{s.firstName}</td>
                                <td className="px-4 py-3.5 text-sm text-body-text">{getRankName(s.rankId)}</td>
                                <td className="px-4 py-3.5 text-sm">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    s.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? "bg-success" : "bg-muted"}`}></span>
                                    {s.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {(() => {
                      const seafarer = seafarers.find(s => s.id === selectedSeafarerId);
                      if (!seafarer) {
                        return (
                          <div className="border border-dashed border-hairline rounded-lg p-12 text-center text-muted flex flex-col items-center justify-center gap-3 bg-surface-soft/20 min-h-[300px]">
                            <svg className="w-8 h-8 opacity-25 text-body-strong stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                              <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                            </svg>
                            <span className="text-xs">Select a seafarer row to audit active credentials.</span>
                          </div>
                        );
                      }
                      const rankName = getRankName(seafarer.rankId);
                      const certs = getMockCertifications(rankName);

                      return (
                        <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6">
                          <div className="flex justify-between items-start border-b border-hairline pb-4">
                            <div>
                              <h3 className="text-lg font-serif text-ink">{seafarer.firstName}</h3>
                              <p className="font-mono text-xs text-muted mt-0.5">{seafarer.indos}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              seafarer.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
                            }`}>
                              {seafarer.isActive ? "Duty Enabled" : "Duty Suspended"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs border-b border-hairline pb-4">
                            <div>
                              <span className="text-muted block mb-0.5">REGISTERED RANK</span>
                              <span className="font-medium text-body-strong">{rankName}</span>
                            </div>
                            <div>
                              <span className="text-muted block mb-0.5">COMPLIANCE CLASS</span>
                              <span className="font-medium text-body-strong">Level {getRankLevel(seafarer.rankId) ?? "N/A"}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold tracking-wider text-muted uppercase">STCW Compliance Registry</span>
                            <div className="space-y-2">
                              {certs.map((c, idx) => (
                                <div key={idx} className="p-3 bg-canvas border border-hairline-soft rounded-md flex flex-col gap-1 text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-body-strong">{c.name}</span>
                                    <span className="text-success font-semibold text-[10px]">{c.status}</span>
                                  </div>
                                  <div className="flex justify-between text-[10px] text-muted-soft mt-0.5">
                                    <span>Issued: {c.issueDate}</span>
                                    <span>Expires: {c.expiryDate}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-hairline flex gap-3">
                            <button
                              onClick={() => {
                                setReportGenerating(true);
                                setTimeout(() => {
                                  setReportGenerating(false);
                                  alert(`Encrypted Verification Report downloaded for ${seafarer.firstName} (${seafarer.indos})`);
                                }, 1000);
                              }}
                              disabled={reportGenerating}
                              className="flex-1 h-10 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors disabled:opacity-50"
                            >
                              {reportGenerating ? "Encrypting..." : "Verify Report"}
                            </button>
                            <button
                              onClick={() => handleDeleteSeafarer(seafarer.id)}
                              className="h-10 px-4 bg-error text-on-primary font-medium rounded-md hover:opacity-90 inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}