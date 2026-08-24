"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllCompanies,
  createCompany,
  toSlug,
  CompanyRequestDTO,
  CompanyResponseDTO
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

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);

  // Search state
  const [companySearch, setCompanySearch] = useState("");

  // Modals & Form
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [compForm, setCompForm] = useState<CompanyRequestDTO>({
    name: "",
    registrationNo: "",
    isActive: true
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const liveCompanies = await getAllCompanies();
      setCompanies(liveCompanies);
    } catch (err: any) {
      console.error("Failed to load company records", err);
      setError("Failed to query shipping companies directory.");
      toast("Error fetching companies from registry", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compForm.name.trim()) {
      toast("Company name is required.", "warning");
      return;
    }

    setSaving(true);
    try {
      const newComp = await createCompany({
        name: compForm.name.trim(),
        registrationNo: compForm.registrationNo?.trim() || undefined,
        isActive: compForm.isActive
      });
      toast("Shipping company registered successfully!", "success");
      setCompanies((prev) => [...prev, newComp]);
      setCompForm({ name: "", registrationNo: "", isActive: true });
      setIsCompanyModalOpen(false);
      router.push(`/companies/${toSlug(newComp.name)}`);
    } catch (err: any) {
      toast(err.message || "Failed to create company.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    (c.registrationNo && c.registrationNo.toLowerCase().includes(companySearch.toLowerCase()))
  );

  return (
    <>
      <PublicLayoutHeader>
        <PageHeader
          title="Shipping Companies"
          subtitle="Manage shipping carriers, fleet vessels, and registered berths."
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[companies.length]}>
        <div className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => setIsCompanyModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs tracking-wide uppercase rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Company
          </button>
        </div>
      </PublicLayoutSidebar>

      <div className="flex flex-col gap-6 w-full font-sans">
        {loading ? (
          <LoadingSkeleton rows={5} type="table" />
        ) : error ? (
          <EmptyState message={error} title="Database Query Error" />
        ) : (
          <>
            <SearchBar
              placeholder="Search shipping companies by name or registration ID..."
              value={companySearch}
              onChange={setCompanySearch}
            />

            {filteredCompanies.length === 0 ? (
              <EmptyState message="No shipping companies registered." title="No Companies" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Company Carrier</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Registration ID</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredCompanies.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => router.push(`/companies/${toSlug(c.name)}`)}
                        className="cursor-pointer transition-colors hover:bg-surface-soft/40"
                      >
                        <td className="px-4 py-3.5 font-semibold text-body-strong font-serif text-sm">{c.name}</td>
                        <td className="px-4 py-3.5 font-mono text-muted">{c.registrationNo || "—"}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={c.isActive ? "true" : "false"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Register Company Modal */}
      <Modal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title="Register Company"
        subtitle="Register a new shipping company carrier into database."
      >
        <form onSubmit={handleCreateCompany} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">COMPANY CARRIER NAME</label>
            <input
              type="text"
              placeholder="e.g. Apex Shipping Line"
              value={compForm.name}
              onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">REGISTRATION ID</label>
            <input
              type="text"
              placeholder="e.g. REG-10023"
              value={compForm.registrationNo}
              onChange={(e) => setCompForm({ ...compForm, registrationNo: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="new-comp-isActive"
              checked={compForm.isActive}
              onChange={(e) => setCompForm({ ...compForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="new-comp-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE SHIPPING CARRIER
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Registering..." : "Save Company"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
