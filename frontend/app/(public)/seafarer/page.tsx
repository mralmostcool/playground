"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getIndosPaginated,
  getAllRanks,
  createIndos,
  IndosMasterRequestDTO,
  IndosMasterResponseDTO,
  RankMasterResponseDTO,
  toSlug
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../PublicLayoutClient";
import {
  PageHeader,
  SearchBar,
  Pagination,
  LoadingSkeleton,
  EmptyState,
  Modal,
  StatusBadge,
  useToast
} from "@/components/ui";

export default function SeafarerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Core States
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [ranks, setRanks] = useState<RankMasterResponseDTO[]>([]);

  // Search & Pagination States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10); // Standard 10 per page
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Form State
  const [form, setForm] = useState<IndosMasterRequestDTO>({
    indos: "",
    firstName: "",
    rankId: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveRanks, paginatedData] = await Promise.all([
        getAllRanks(),
        getIndosPaginated(page, size, search)
      ]);

      setRanks(liveRanks);
      if (paginatedData && paginatedData.content) {
        setSeafarers(paginatedData.content);
        setTotalPages(paginatedData.totalPages);
        setTotalElements(paginatedData.totalElements);
      }
    } catch (err: any) {
      console.error("Failed to load seafarer registry data", err);
      setError("Failed to sync with maritime registry databases.");
      toast("Failed to sync registry data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when page or search changes
  useEffect(() => {
    loadData();
  }, [page, search]);

  // Reset page to 0 when search term changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  const getRankName = (rankId: string) => {
    return ranks.find((r) => r.id === rankId)?.name ?? "Unknown Rank";
  };

  // Create Seafarer Handler
  const handleAddSeafarer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.indos || form.indos.trim().length !== 7) {
      toast("INDOS number must be exactly 7 characters.", "warning");
      return;
    }
    if (!form.firstName || form.firstName.trim().length === 0) {
      toast("First Name is required.", "warning");
      return;
    }
    if (!form.rankId) {
      toast("Please select a Rank.", "warning");
      return;
    }

    setSaving(true);
    try {
      await createIndos({
        indos: form.indos.toUpperCase(),
        firstName: form.firstName,
        rankId: form.rankId,
        isActive: form.isActive
      });
      toast("Seafarer registered successfully.", "success");
      await loadData();

      // Reset form
      setForm({ indos: "", firstName: "", rankId: "", isActive: true });
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast(err.message || "An error occurred while creating seafarer.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PublicLayoutHeader deps={[totalPages, totalElements]}>
        <PageHeader
          title="Seafarer Services"
          subtitle="A secure public registry enabling seafarers to audit credentials, view qualification training, and manage active profiles."
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[totalElements]}>
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase font-sans">Registry Stats</h3>
            <div className="grid grid-cols-2 gap-4 font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-serif text-ink">{totalElements}</span>
                <span className="text-[9px] text-muted-soft font-mono uppercase tracking-wider">Total Registered</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-serif text-success">
                  {seafarers.filter(s => s.isActive).length}
                </span>
                <span className="text-[9px] text-muted-soft font-mono uppercase tracking-wider">Active on Page</span>
              </div>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="flex flex-col gap-6">
        {loading ? (
          <LoadingSkeleton rows={5} type="table" />
        ) : error ? (
          <EmptyState message={error} title="Database Sync Failed" />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <SearchBar
                  placeholder="Search seafarers by name, INDOS registry or rank..."
                  value={search}
                  onChange={setSearch}
                />
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs tracking-wide uppercase transition-colors cursor-pointer flex-shrink-0"
              >
                Add New Seafarer
              </button>
            </div>

            {seafarers.length === 0 ? (
              <EmptyState message="No seafarers registered in this directory matches your query." title="No Seafarers Found" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden font-sans">
                  <thead>
                    <tr className="bg-surface-card border-b border-hairline">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">INDOS Registry</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">First Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Active Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {seafarers.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => router.push(`/seafarer/${s.indos}`)}
                        className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                      >
                        <td className="px-4 py-3.5 text-sm font-mono font-medium text-ink">{s.indos}</td>
                        <td className="px-4 py-3.5 text-sm text-body-strong">{s.firstName}</td>
                        <td className="px-4 py-3.5 text-sm text-body-text">{getRankName(s.rankId)}</td>
                        <td className="px-4 py-3.5 text-sm">
                          <StatusBadge status={s.isActive ? "true" : "false"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Seafarer"
        subtitle="Register a new profile with active INDOS compliance data."
      >
        <form onSubmit={handleAddSeafarer} className="flex flex-col gap-4 font-sans">
          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
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
              {saving ? "Registering..." : "Save Seafarer"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}