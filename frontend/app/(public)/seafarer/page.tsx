"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getIndosPaginated,
  getAllRanks,
  createIndos,
  IndosMasterRequestDTO,
  IndosMasterResponseDTO,
  RankMasterResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../PublicLayoutClient";

export default function SeafarerPage() {
  const router = useRouter();
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
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
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
      // Call backend API
      await createIndos({
        indos: form.indos.toUpperCase(),
        firstName: form.firstName,
        rankId: form.rankId,
        isActive: form.isActive
      });
      setFormSuccess("Seafarer registered successfully.");
      await loadData();

      // Reset form
      setForm({ indos: "", firstName: "", rankId: "", isActive: true });

      // Auto close modal after a delay
      setTimeout(() => {
        setFormSuccess(null);
        setIsAddModalOpen(false);
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating seafarer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Set Header in Left Column */}
      <PublicLayoutHeader deps={[totalPages, totalElements]}>
        <span className="text-xs text-primary font-bold uppercase tracking-wider">Public Access Panel</span>
        <h1 className="text-3xl font-serif text-ink">Seafarer Services</h1>
        <p className="text-muted text-sm leading-relaxed mt-2">
          A secure public registry enabling seafarers to audit credentials, view qualification training, and manage active profiles.
        </p>
      </PublicLayoutHeader>

      {/* Set Sidebar Content in Left Column */}
      <PublicLayoutSidebar deps={[totalElements]}>
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Registry Stats</h3>
            <div className="grid grid-cols-2 gap-4">
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

      {/* Right Column: Main Content */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">
            Syncing with maritime registries...
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20 text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Action Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search seafarers by name, INDOS registry or rank..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-input px-4 bg-canvas text-ink border border-muted focus:border-primary rounded-md outline-none"
                  style={{ height: "42px" }}
                />
              </div>
              <button
                onClick={() => {
                  setFormError(null);
                  setFormSuccess(null);
                  setIsAddModalOpen(true);
                }}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-sm transition-colors cursor-pointer flex-shrink-0"
              >
                Add New Seafarer
              </button>
            </div>

            {/* Registry Table */}
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
                  {seafarers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                        No seafarers registered in directory.
                      </td>
                    </tr>
                  ) : (
                    seafarers.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => router.push(`/seafarer/${s.indos}`)}
                        className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                      >
                        <td className="px-4 py-3.5 text-sm font-mono font-medium text-ink">{s.indos}</td>
                        <td className="px-4 py-3.5 text-sm text-body-strong">{s.firstName}</td>
                        <td className="px-4 py-3.5 text-sm text-body-text">{getRankName(s.rankId)}</td>
                        <td className="px-4 py-3.5 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? "bg-success" : "bg-muted"}`}></span>
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-hairline pt-4 mt-2 text-xs">
                <span className="text-muted font-mono">
                  Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} seafarers
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed font-medium"
                  >
                    Previous
                  </button>
                  <span className="font-mono text-body-strong">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="h-8 px-3 border border-hairline rounded bg-canvas hover:bg-surface-soft hover:text-ink disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add New Seafarer Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Add New Seafarer</h2>
                <p className="text-[11px] text-muted mt-0.5">Register a new profile with active INDOS compliance data.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3 bg-error/10 text-error rounded-md text-xs font-medium border border-error/20">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-success/10 text-success rounded-md text-xs font-medium border border-success/20">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleAddSeafarer} className="flex flex-col gap-4">
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

                {/* Modal Actions */}
                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
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
                    className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Registering..." : "Save Seafarer"}
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