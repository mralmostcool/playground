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

export default function CompaniesPage() {
  const router = useRouter();
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

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!compForm.name || compForm.name.trim().length === 0) {
      setFormError("Company name is required.");
      return;
    }

    setSaving(true);
    try {
      const newComp = await createCompany({
        name: compForm.name.trim(),
        registrationNo: compForm.registrationNo?.trim() || undefined,
        isActive: compForm.isActive
      });
      setFormSuccess("Shipping company registered successfully!");
      setCompanies((prev) => [...prev, newComp]);
      setTimeout(() => {
        setFormSuccess(null);
        setIsCompanyModalOpen(false);
        setCompForm({ name: "", registrationNo: "", isActive: true });
        router.push(`/companies/${toSlug(newComp.name)}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while creating company.");
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
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-ink">Shipping Companies</h1>
          <p className="text-xs text-muted">Manage shipping carriers, fleet vessels, and registered berths.</p>
        </div>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[companies]}>
        <div className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => setIsCompanyModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Register Shipping Company
          </button>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full">
        {loading ? (
          <div className="py-24 text-center text-sm text-muted">
            Connecting to shipping registry databases...
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <span className="p-3 bg-error/10 text-error rounded-md text-xs font-semibold">{error}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search shipping companies by name or registration number..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full text-input px-4 bg-surface-card border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-surface-card border border-hairline rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                    <th className="px-6 py-3.5 text-left font-semibold uppercase">Company Name</th>
                    <th className="px-6 py-3.5 text-left font-semibold uppercase">Registration No</th>
                    <th className="px-6 py-3.5 text-left font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-xs">
                  {filteredCompanies.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/companies/${toSlug(c.name)}`)}
                      className="hover:bg-surface-soft/40 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-serif text-sm text-ink">{c.name}</td>
                      <td className="px-6 py-4 font-mono text-muted">{c.registrationNo || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          c.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
                        }`}>
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-muted">
                        No shipping companies found in directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Register Company Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Register Company</h2>
                <p className="text-[11px] text-muted mt-0.5">Add a new shipping company to the directory.</p>
              </div>
              <button
                onClick={() => {
                  setIsCompanyModalOpen(false);
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

              <form onSubmit={handleCreateCompany} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">COMPANY NAME</label>
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
                  <label className="text-xs font-semibold text-body-strong">REGISTRATION NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-10001"
                    value={compForm.registrationNo}
                    onChange={(e) => setCompForm({ ...compForm, registrationNo: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={compForm.isActive}
                    onChange={(e) => setCompForm({ ...compForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    Is active carrier
                  </label>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompanyModalOpen(false);
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
                    {saving ? "Saving..." : "Register"}
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
