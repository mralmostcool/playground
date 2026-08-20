"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getAllVessels,
  getAllBerths,
  getAllBerthAllocations,
  createBerth,
  createBerthAllocation,
  updateVessel,
  deleteVessel,
  toSlug,
  CompanyResponseDTO,
  VesselResponseDTO,
  BerthResponseDTO,
  BerthAllocationResponseDTO,
  VesselRequestDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../../PublicLayoutClient";

// Helper to filter vessels by company prefix or local storage mapping
const getVesselCompany = (vessel: VesselResponseDTO, companies: CompanyResponseDTO[]) => {
  // Load custom mapping from localStorage
  if (typeof window !== "undefined") {
    const customMapRaw = localStorage.getItem("vessel_company_map");
    const customMap = customMapRaw ? JSON.parse(customMapRaw) : {};
    const customCompId = customMap[vessel.id];
    if (customCompId) {
      const found = companies.find(c => c.id === customCompId);
      if (found) return found;
    }
  }

  // Fallback to name prefix matches for seeded database elements
  const match = companies.find(c => {
    const prefix = c.name.split(" ")[0].toLowerCase();
    return vessel.name.toLowerCase().startsWith(prefix);
  });
  return match || null;
};

export default function VesselDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vesselSlug = params.vesselSlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core records
  const [company, setCompany] = useState<CompanyResponseDTO | null>(null);
  const [vessel, setVessel] = useState<VesselResponseDTO | null>(null);
  const [allocations, setAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);

  // Navigation
  const [activeTab, setActiveTab] = useState<"berths">("berths");

  // Modals & forms
  const [isEditVesselModalOpen, setIsEditVesselModalOpen] = useState(false);
  const [isBerthModalOpen, setIsBerthModalOpen] = useState(false);

  const [editVesselForm, setEditVesselForm] = useState<VesselRequestDTO>({
    imo: "",
    name: "",
    flag: "",
    isActive: true
  });

  const [berthForm, setBerthForm] = useState({
    berthName: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allComps, allVessels, allBerths, allAllocations] = await Promise.all([
        getAllCompanies(),
        getAllVessels(),
        getAllBerths(),
        getAllBerthAllocations()
      ]);

      const foundVessel = allVessels.find((v) => toSlug(v.name) === vesselSlug);
      if (!foundVessel) {
        setError("Vessel record not found.");
        return;
      }

      const foundComp = getVesselCompany(foundVessel, allComps);

      setCompany(foundComp);
      setVessel(foundVessel);
      setEditVesselForm({
        imo: foundVessel.imo,
        name: foundVessel.name,
        flag: foundVessel.flag,
        isActive: foundVessel.isActive
      });

      // Filter allocations matching this vessel
      const vesselAllocations = allAllocations.filter((a) => a.vesselId === foundVessel.id);
      setAllocations(vesselAllocations);
      setBerths(allBerths);
    } catch (err: any) {
      console.error("Failed to query vessel details", err);
      setError("Failed to query database records for this vessel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vesselSlug) {
      loadData();
    }
  }, [vesselSlug]);

  const handleUpdateVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vessel) return;
    setFormError(null);
    setFormSuccess(null);

    if (!editVesselForm.imo || !editVesselForm.name || !editVesselForm.flag) {
      setFormError("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      await updateVessel(vessel.id, {
        imo: editVesselForm.imo.trim(),
        name: editVesselForm.name.trim(),
        flag: editVesselForm.flag.trim(),
        isActive: editVesselForm.isActive
      });
      setFormSuccess("Vessel updated successfully.");
      const newVesselSlug = toSlug(editVesselForm.name.trim());
      setTimeout(() => {
        setFormSuccess(null);
        setIsEditVesselModalOpen(false);
        router.push(`/vessels/${newVesselSlug}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to update vessel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVessel = async () => {
    if (!vessel) return;
    if (!confirm("Are you sure you want to delete this fleet vessel?")) return;
    setSaving(true);
    try {
      await deleteVessel(vessel.id);
      alert("Vessel deleted successfully.");
      router.push("/vessels");
    } catch (err: any) {
      alert(err.message || "Failed to delete vessel.");
    } finally {
      setSaving(false);
    }
  };

  const handleAllocateBerth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vessel) return;
    setFormError(null);
    setFormSuccess(null);

    if (!berthForm.berthName || !berthForm.startDate || !berthForm.endDate) {
      setFormError("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      // 1. Create a new Berth
      const newBerth = await createBerth({
        berthName: berthForm.berthName.trim(),
        isActive: true
      });

      // 2. Allocate the newly created Berth to this Vessel
      const newAllocation = await createBerthAllocation({
        berthId: newBerth.id,
        vesselId: vessel.id,
        startDate: new Date(berthForm.startDate).toISOString(),
        endDate: new Date(berthForm.endDate).toISOString()
      });

      setFormSuccess("Berth registered and allocated successfully!");
      setBerths((prev) => [...prev, newBerth]);
      setAllocations((prev) => [...prev, newAllocation]);

      setTimeout(() => {
        setFormSuccess(null);
        setIsBerthModalOpen(false);
        setBerthForm({
          berthName: "",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        });
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to register and allocate berth.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted">
        Loading fleet berth mappings...
      </div>
    );
  }

  if (error || !vessel) {
    return (
      <div className="py-24 text-center">
        <span className="p-3 bg-error/10 text-error rounded-md text-xs font-semibold">{error || "Record not found"}</span>
      </div>
    );
  }

  return (
    <>
      <PublicLayoutHeader>
        <div className="flex flex-col gap-2">
          <Link href="/vessels" className="text-xs text-primary hover:underline font-mono">
            &larr; Back to Vessels
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-serif text-ink">{vessel.name}</h1>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
              vessel.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
            }`}>
              {vessel.isActive ? "Active vessel" : "Inactive vessel"}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-soft">
            IMO: {vessel.imo} | Flag: {vessel.flag} | Company: {company ? company.name : "Unassigned"}
          </span>
        </div>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("berths")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "berths"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Allocated Berths
            </button>
          </nav>

          <button
            onClick={() => setIsBerthModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Allocate New Berth
          </button>

          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Vessel Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditVesselModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Vessel Details
              </button>
              <button
                onClick={handleDeleteVessel}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Vessel
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full">
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-surface-card border border-hairline rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Berth Name</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Start Date</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">End Date</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-xs">
                {allocations.map((a) => {
                  const berthName = berths.find((b) => b.id === a.berthId)?.berthName ?? "Unknown Berth";
                  const startStr = new Date(a.startDate).toLocaleDateString();
                  const endStr = new Date(a.endDate).toLocaleDateString();
                  
                  const now = Date.now();
                  const startMs = new Date(a.startDate).getTime();
                  const endMs = new Date(a.endDate).getTime();
                  const isCurrent = now >= startMs && now <= endMs;

                  return (
                    <tr key={a.id} className="hover:bg-surface-soft/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-body-strong">{berthName}</td>
                      <td className="px-6 py-4 font-mono text-muted">{startStr}</td>
                      <td className="px-6 py-4 font-mono text-muted">{endStr}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          isCurrent ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                        }`}>
                          {isCurrent ? "Current Allocation" : "Expired/Scheduled"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {allocations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted">
                      No berths currently registered/allocated to this vessel.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Vessel Modal */}
      {isEditVesselModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Edit Vessel Details</h2>
                <p className="text-[11px] text-muted mt-0.5">Modify information for this fleet vessel.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditVesselModalOpen(false);
                  setFormError(null);
                  setFormSuccess(null);
                }}
                className="text-muted hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formError && <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">{formError}</div>}
              {formSuccess && <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">{formSuccess}</div>}

              <form onSubmit={handleUpdateVessel} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">VESSEL NAME</label>
                  <input
                    type="text"
                    value={editVesselForm.name}
                    onChange={(e) => setEditVesselForm({ ...editVesselForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">IMO NUMBER</label>
                  <input
                    type="text"
                    value={editVesselForm.imo}
                    onChange={(e) => setEditVesselForm({ ...editVesselForm, imo: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">FLAG STATE</label>
                  <input
                    type="text"
                    value={editVesselForm.flag}
                    onChange={(e) => setEditVesselForm({ ...editVesselForm, flag: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editVesselIsActive"
                    checked={editVesselForm.isActive}
                    onChange={(e) => setEditVesselForm({ ...editVesselForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="editVesselIsActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    Is active vessel
                  </label>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditVesselModalOpen(false);
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Berth Modal */}
      {isBerthModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Allocate New Berth</h2>
                <p className="text-[11px] text-muted mt-0.5">Register a new berth and allocate it to this vessel.</p>
              </div>
              <button
                onClick={() => {
                  setIsBerthModalOpen(false);
                  setFormError(null);
                  setFormSuccess(null);
                }}
                className="text-muted hover:text-ink transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formError && <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">{formError}</div>}
              {formSuccess && <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">{formSuccess}</div>}

              <form onSubmit={handleAllocateBerth} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">BERTH NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Berth North-03"
                    value={berthForm.berthName}
                    onChange={(e) => setBerthForm({ ...berthForm, berthName: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">START DATE</label>
                  <input
                    type="date"
                    value={berthForm.startDate}
                    onChange={(e) => setBerthForm({ ...berthForm, startDate: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">END DATE</label>
                  <input
                    type="date"
                    value={berthForm.endDate}
                    onChange={(e) => setBerthForm({ ...berthForm, endDate: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBerthModalOpen(false);
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Allocate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
