"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllBerths,
  getAllBerthAllocations,
  getAllVessels,
  createBerth,
  toSlug,
  BerthResponseDTO,
  BerthAllocationResponseDTO,
  VesselResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  LoadingSkeleton,
  EmptyState,
  Modal,
  StatusBadge,
  useToast
} from "@/components/ui";

export default function BerthsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);
  const [allocations, setAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);

  // Search/Filter
  const [search, setSearch] = useState("");
  const [filterVesselId, setFilterVesselId] = useState("");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [berthForm, setBerthForm] = useState({
    berthName: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveBerths, liveAllocations, liveVessels] = await Promise.all([
        getAllBerths(),
        getAllBerthAllocations(),
        getAllVessels()
      ]);
      setBerths(liveBerths);
      setAllocations(liveAllocations);
      setVessels(liveVessels);
    } catch (err: any) {
      console.error("Failed to load berths registry", err);
      setError("Failed to query maritime berth registries.");
      toast("Error fetching berths", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBerth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!berthForm.berthName.trim()) {
      toast("Berth Name is required.", "warning");
      return;
    }
    setSaving(true);
    try {
      const newBerth = await createBerth({
        berthName: berthForm.berthName.trim(),
        isActive: berthForm.isActive
      });
      toast("Training berth registered successfully.", "success");
      setBerths((prev) => [...prev, newBerth]);
      setBerthForm({ berthName: "", isActive: true });
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to create berth.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Resolve current vessel allocation for a berth
  const getCurrentAllocation = (berthId: string) => {
    const berthAllocs = allocations.filter((a) => a.berthId === berthId);
    const now = Date.now();
    const active = berthAllocs.find((a) => {
      const start = new Date(a.startDate).getTime();
      const end = new Date(a.endDate).getTime();
      return now >= start && now <= end;
    });
    if (!active) return null;
    return vessels.find((v) => v.id === active.vesselId) || null;
  };

  const filteredBerths = berths.filter((b) => {
    const matchesSearch = b.berthName.toLowerCase().includes(search.toLowerCase());
    
    // Filter by vessel assignment
    if (filterVesselId) {
      const berthAllocs = allocations.filter((a) => a.berthId === b.id);
      const assignedToVessel = berthAllocs.some((a) => a.vesselId === filterVesselId);
      return matchesSearch && assignedToVessel;
    }

    return matchesSearch;
  });

  return (
    <>
      <PublicLayoutHeader>
        <PageHeader
          title="Training Berths"
          subtitle="Audit merchant vessel training berths, current cadet allocations, and shipboard availability."
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[berths.length]}>
        <div className="flex flex-col gap-6 mt-4 font-sans">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs tracking-wide uppercase rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Berth
          </button>
        </div>
      </PublicLayoutSidebar>

      <div className="flex flex-col gap-6 w-full font-sans">
        {loading ? (
          <LoadingSkeleton rows={5} type="table" />
        ) : error ? (
          <EmptyState message={error} title="Database Registry Error" />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <SearchBar
                  placeholder="Search berths by name..."
                  value={search}
                  onChange={setSearch}
                />
              </div>

              <select
                value={filterVesselId}
                onChange={(e) => setFilterVesselId(e.target.value)}
                className="h-10 text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm w-full sm:w-64"
              >
                <option value="">Filter by Assigned Vessel (All)</option>
                {vessels.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredBerths.length === 0 ? (
              <EmptyState message="No berths matches your selection." title="No Berths Found" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Berth Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Current Vessel Assignment</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredBerths.map((b) => {
                      const currentVessel = getCurrentAllocation(b.id);
                      return (
                        <tr
                          key={b.id}
                          onClick={() => router.push(`/berths/${toSlug(b.berthName)}`)}
                          className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                        >
                          <td className="px-4 py-3.5 font-semibold text-body-strong font-serif text-sm">{b.berthName}</td>
                          <td className="px-4 py-3.5 text-body-text">
                            {currentVessel ? (
                              <span className="font-semibold text-primary">{currentVessel.name}</span>
                            ) : (
                              <span className="text-muted italic">Unassigned (Vacant)</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={b.isActive ? "true" : "false"} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Register Berth Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Berth"
        subtitle="Register a new vessel training berth slot."
      >
        <form onSubmit={handleCreateBerth} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">BERTH DISPLAY NAME</label>
            <input
              type="text"
              placeholder="e.g. Berth Cadet-01"
              value={berthForm.berthName}
              onChange={(e) => setBerthForm({ ...berthForm, berthName: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="new-berth-isActive"
              checked={berthForm.isActive}
              onChange={(e) => setBerthForm({ ...berthForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="new-berth-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE TRAINING BERTH
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Registering..." : "Save Berth"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
