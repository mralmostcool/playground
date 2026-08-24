"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getAllVessels,
  getAllBerths,
  getAllBerthAllocations,
  getAllBerthSeafarerAllocations,
  getAllContracts,
  getAllIndos,
  createBerth,
  createBerthAllocation,
  updateVessel,
  deleteVessel,
  toSlug,
  CompanyResponseDTO,
  VesselResponseDTO,
  BerthResponseDTO,
  BerthAllocationResponseDTO,
  BerthSeafarerAllocationResponseDTO,
  ContractResponseDTO,
  IndosMasterResponseDTO,
  VesselRequestDTO,
  getVesselCompanyId
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  LoadingSkeleton,
  EmptyState,
  Modal,
  ConfirmDialog,
  StatusBadge,
  TabBar,
  InfoRow,
  useToast
} from "@/components/ui";

type TabId = "berths" | "crew";

export default function VesselDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const vesselSlug = params.vesselSlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core entities
  const [vessel, setVessel] = useState<VesselResponseDTO | null>(null);
  const [company, setCompany] = useState<CompanyResponseDTO | null>(null);
  const [allocations, setAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);

  // Operational entities for tabs
  const [berthSeafarerAllocations, setBerthSeafarerAllocations] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  const [contracts, setContracts] = useState<ContractResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<TabId>("berths");

  // Modals & forms
  const [isEditVesselModalOpen, setIsEditVesselModalOpen] = useState(false);
  const [isBerthModalOpen, setIsBerthModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

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

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        allComps,
        allVessels,
        allBerths,
        allAllocations,
        allBSAllocations,
        allContracts,
        allSeafarers
      ] = await Promise.all([
        getAllCompanies(),
        getAllVessels(),
        getAllBerths(),
        getAllBerthAllocations(),
        getAllBerthSeafarerAllocations(),
        getAllContracts(),
        getAllIndos()
      ]);

      const foundVessel = allVessels.find((v) => toSlug(v.name) === vesselSlug);
      if (!foundVessel) {
        setError("Vessel record not found.");
        return;
      }

      setVessel(foundVessel);
      setEditVesselForm({
        imo: foundVessel.imo,
        name: foundVessel.name,
        flag: foundVessel.flag,
        isActive: foundVessel.isActive
      });

      const foundComp = allComps.find(c => c.id === getVesselCompanyId(foundVessel.id, foundVessel.name, allComps));
      setCompany(foundComp || null);

      // Filter allocations for this vessel
      const vesselAllocations = allAllocations.filter((a) => a.vesselId === foundVessel.id);
      setAllocations(vesselAllocations);
      setBerths(allBerths);
      setBerthSeafarerAllocations(allBSAllocations);
      setContracts(allContracts);
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to query vessel details", err);
      setError("Failed to query database records for this vessel.");
      toast("Error loading vessel records", "error");
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

    if (!editVesselForm.imo || !editVesselForm.name || !editVesselForm.flag) {
      toast("All fields are required.", "warning");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateVessel(vessel.id, {
        imo: editVesselForm.imo.trim(),
        name: editVesselForm.name.trim(),
        flag: editVesselForm.flag.trim(),
        isActive: editVesselForm.isActive
      });
      toast("Vessel details updated successfully.", "success");
      const newVesselSlug = toSlug(editVesselForm.name.trim());
      setIsEditVesselModalOpen(false);
      router.push(`/vessels/${newVesselSlug}`);
    } catch (err: any) {
      toast(err.message || "Failed to update vessel.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVessel = async () => {
    if (!vessel) return;
    try {
      await deleteVessel(vessel.id);
      toast("Vessel record deleted successfully.", "success");
      router.push("/vessels");
    } catch (err: any) {
      toast(err.message || "Failed to delete vessel.", "error");
    }
  };

  const handleAllocateBerth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vessel) return;

    if (!berthForm.berthName || !berthForm.startDate || !berthForm.endDate) {
      toast("All fields are required.", "warning");
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

      toast("Berth registered and allocated successfully!", "success");
      setBerths((prev) => [...prev, newBerth]);
      setAllocations((prev) => [...prev, newAllocation]);
      setBerthForm({
        berthName: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      });
      setIsBerthModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to register and allocate berth.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getTraineeForBerthAllocation = (berthId: string, allocationId: string) => {
    const sAlloc = berthSeafarerAllocations.find(sa => sa.berthId === berthId && sa.berthAllocationId === allocationId);
    if (!sAlloc) return null;
    return seafarers.find(x => x.id === sAlloc.indosMasterId);
  };

  // Find all seafarers associated with contracts on this vessel
  const vesselAllocationIds = allocations.map(a => a.id);
  const vesselSeafarerAllocations = berthSeafarerAllocations.filter(sa =>
    sa.berthAllocationId && vesselAllocationIds.includes(sa.berthAllocationId)
  );
  const vesselSeafarerIds = vesselSeafarerAllocations.map(sa => sa.indosMasterId);

  const vesselContracts = contracts.filter(c =>
    vesselSeafarerAllocations.some(sa => sa.id === c.berthSeafarerAllocationId)
  );

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !vessel) {
    return (
      <EmptyState
        message={error || "Vessel details could not be resolved."}
        title="Vessel Registry Error"
        ctaLabel="Back to Vessels"
        onCtaClick={() => router.push("/vessels")}
      />
    );
  }

  return (
    <>
      <PublicLayoutHeader deps={[vessel.id, vessel.name, vessel.isActive]}>
        <PageHeader
          title={vessel.name}
          subtitle={`IMO: ${vessel.imo} | Flag: ${vessel.flag} | Carrier: ${company ? company.name : "Unassigned"}`}
          backHref="/vessels"
          backLabel="Back to Vessels"
        >
          <StatusBadge status={vessel.isActive ? "true" : "false"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 font-sans">
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
            <button
              onClick={() => setActiveTab("crew")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "crew"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Crew Timeline
            </button>
          </nav>

          <button
            onClick={() => setIsBerthModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs tracking-wide uppercase rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Allocate Berth
          </button>

          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4 font-sans">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Vessel Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditVesselModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Vessel Details
              </button>
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Vessel
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        <TabBar
          tabs={[
            { id: "berths", label: "Allocated Berths" },
            { id: "crew", label: "Crew Timeline History" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "berths" && (
          <div className="flex flex-col gap-6">
            {allocations.length === 0 ? (
              <EmptyState message="No training berths are currently allocated to this vessel." title="No Allocated Berths" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Berth Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Active Trainee</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Start Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">End Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {allocations.map((a) => {
                      const berthName = berths.find((b) => b.id === a.berthId)?.berthName ?? "Unknown Berth";
                      const trainee = getTraineeForBerthAllocation(a.berthId, a.id);

                      const now = Date.now();
                      const startMs = new Date(a.startDate).getTime();
                      const endMs = new Date(a.endDate).getTime();
                      const isCurrent = now >= startMs && now <= endMs;

                      return (
                        <tr key={a.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-body-strong">{berthName}</td>
                          <td className="px-4 py-3.5 text-body-text">
                            {trainee ? (
                              <Link href={`/seafarer/${trainee.indos}`} className="text-primary hover:underline font-semibold">
                                {trainee.firstName} ({trainee.indos})
                              </Link>
                            ) : (
                              <span className="text-muted italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.startDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.endDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                            }`}>
                              {isCurrent ? "Active Allocation" : "Expired / Scheduled"}
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

        {activeTab === "crew" && (
          <div className="flex flex-col gap-6">
            {vesselContracts.length === 0 ? (
              <EmptyState message="No seafarer crew training contracts logged on this vessel." title="No Crew Timeline" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Crew Member</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">INDOS ID</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Planned Dates</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Actual Sign On/Off</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {vesselContracts.map((c) => {
                      const s = seafarers.find(x => x.id === c.indosMasterId);
                      if (!s) return null;
                      return (
                        <tr key={c.id} className="hover:bg-surface-soft/20 transition-colors">
                          <td className="px-4 py-3.5">
                            <Link href={`/seafarer/${s.indos}`} className="text-primary hover:underline font-semibold">
                              {s.firstName}
                            </Link>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted">{s.indos}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">
                            {c.signOnDate.split("T")[0]} &rarr; {c.signOffDate.split("T")[0]}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <span>On: {c.actualSignOnDate ? c.actualSignOnDate.split("T")[0] : <span className="text-muted italic">Pending</span>}</span>
                              <span>Off: {c.actualSignOffDate ? c.actualSignOffDate.split("T")[0] : <span className="text-muted italic">Pending</span>}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={c.status || "DRAFT"} />
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
      </div>

      {/* Edit Vessel Modal */}
      <Modal
        isOpen={isEditVesselModalOpen}
        onClose={() => setIsEditVesselModalOpen(false)}
        title="Edit Vessel Details"
        subtitle="Modify information for this fleet vessel."
      >
        <form onSubmit={handleUpdateVessel} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">VESSEL REGISTER NAME</label>
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
            <label className="text-xs font-semibold text-body-strong">FLAG STATE REGISTRY</label>
            <input
              type="text"
              value={editVesselForm.flag}
              onChange={(e) => setEditVesselForm({ ...editVesselForm, flag: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="edit-vessel-isActive"
              checked={editVesselForm.isActive}
              onChange={(e) => setEditVesselForm({ ...editVesselForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="edit-vessel-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE SERVICE REGISTERED
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsEditVesselModalOpen(false)}
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

      {/* Allocate Berth Modal */}
      <Modal
        isOpen={isBerthModalOpen}
        onClose={() => setIsBerthModalOpen(false)}
        title="Allocate New Berth"
        subtitle="Register a new berth and allocate it to this vessel."
      >
        <form onSubmit={handleAllocateBerth} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">BERTH CURRICULUM NAME</label>
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
            <label className="text-xs font-semibold text-body-strong">ALLOCATION START DATE</label>
            <input
              type="date"
              value={berthForm.startDate}
              onChange={(e) => setBerthForm({ ...berthForm, startDate: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">ALLOCATION END DATE</label>
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
              onClick={() => setIsBerthModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Allocating..." : "Allocate"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Vessel Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteVessel}
        title="Confirm Vessel Deletion"
        message="Are you sure you want to delete this fleet vessel registry? This will clear all its allocated berths and crew contracts history records permanently."
        confirmLabel="Delete permanently"
        isDestructive={true}
      />
    </>
  );
}
