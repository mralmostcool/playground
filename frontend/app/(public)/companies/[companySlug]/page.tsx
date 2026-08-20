"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getAllVessels,
  createVessel,
  updateCompany,
  deleteCompany,
  toSlug,
  CompanyResponseDTO,
  VesselResponseDTO,
  VesselRequestDTO,
  CompanyRequestDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";

// Helper to filter vessels by company prefix or local storage mapping
const getCompanyVessels = (companyId: string, allVessels: VesselResponseDTO[], companyName: string) => {
  const prefix = companyName.split(" ")[0].toLowerCase();
  const seeded = allVessels.filter((v) => v.name.toLowerCase().startsWith(prefix));

  if (typeof window !== "undefined") {
    const customMapRaw = localStorage.getItem("vessel_company_map");
    const customMap = customMapRaw ? JSON.parse(customMapRaw) : {};
    const custom = allVessels.filter((v) => customMap[v.id] === companyId);

    const map = new Map<string, VesselResponseDTO>();
    seeded.forEach((v) => map.set(v.id, v));
    custom.forEach((v) => map.set(v.id, v));
    return Array.from(map.values());
  }
  return seeded;
};

// Helper to register new vessel mapping in local storage
const registerVesselToCompany = (vesselId: string, companyId: string) => {
  if (typeof window !== "undefined") {
    const customMapRaw = localStorage.getItem("vessel_company_map");
    const customMap = customMapRaw ? JSON.parse(customMapRaw) : {};
    customMap[vesselId] = companyId;
    localStorage.setItem("vessel_company_map", JSON.stringify(customMap));
  }
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.companySlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [company, setCompany] = useState<CompanyResponseDTO | null>(null);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);

  // Search & Navigation
  const [vesselSearch, setVesselSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"vessels">("vessels");

  const [isEditCompModalOpen, setIsEditCompModalOpen] = useState(false);
  const [editCompForm, setEditCompForm] = useState<CompanyRequestDTO>({
    name: "",
    isActive: true
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allComps, allVessels] = await Promise.all([
        getAllCompanies(),
        getAllVessels()
      ]);

      const foundComp = allComps.find((c) => toSlug(c.name) === companySlug);
      if (!foundComp) {
        setError("Shipping company record not found.");
        return;
      }

      setCompany(foundComp);
      setEditCompForm({ name: foundComp.name, isActive: foundComp.isActive });

      const compVessels = getCompanyVessels(foundComp.id, allVessels, foundComp.name);
      setVessels(compVessels);
    } catch (err: any) {
      console.error("Failed to query company details", err);
      setError("Failed to query registry database for this shipping company.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companySlug) {
      loadData();
    }
  }, [companySlug]);

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setFormError(null);
    setFormSuccess(null);

    if (!editCompForm.name || editCompForm.name.trim().length === 0) {
      setFormError("Company name is required.");
      return;
    }

    setSaving(true);
    try {
      await updateCompany(company.id, {
        name: editCompForm.name.trim(),
        registrationNo: company.registrationNo,
        isActive: editCompForm.isActive
      });
      setFormSuccess("Company updated successfully.");
      const newSlug = toSlug(editCompForm.name.trim());
      setTimeout(() => {
        setFormSuccess(null);
        setIsEditCompModalOpen(false);
        router.push(`/companies/${newSlug}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to update shipping company.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!company) return;
    if (!confirm("Are you sure you want to delete this shipping company? This will remove all associated fleet records.")) return;
    setSaving(true);
    try {
      await deleteCompany(company.id);
      alert("Company deleted successfully.");
      router.push("/companies");
    } catch (err: any) {
      alert(err.message || "Failed to delete company.");
    } finally {
      setSaving(false);
    }
  };



  const filteredVessels = vessels.filter((v) =>
    v.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
    v.imo.toLowerCase().includes(vesselSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted">
        Syncing fleet records with shipping registers...
      </div>
    );
  }

  if (error || !company) {
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
          <Link href="/companies" className="text-xs text-primary hover:underline font-mono">
            &larr; Back to Companies
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl font-serif text-ink">{company.name}</h1>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
              company.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
            }`}>
              {company.isActive ? "Active Carrier" : "Inactive Carrier"}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-soft">REG: {company.registrationNo || "—"}</span>
        </div>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("vessels")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "vessels"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Registered Vessels
            </button>
          </nav>


          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Company Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditCompModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Company Name
              </button>
              <button
                onClick={handleDeleteCompany}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search fleet vessels by name or IMO..."
              value={vesselSearch}
              onChange={(e) => setVesselSearch(e.target.value)}
              className="w-full text-input px-4 bg-surface-card border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-surface-card border border-hairline rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline text-[11px] text-muted">
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Vessel Name</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">IMO Number</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Flag State</th>
                  <th className="px-6 py-3.5 text-left font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-xs">
                {filteredVessels.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-surface-soft/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-serif text-sm text-ink">{v.name}</td>
                    <td className="px-6 py-4 font-mono text-muted">{v.imo}</td>
                    <td className="px-6 py-4 text-body-text">{v.flag}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        v.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
                      }`}>
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredVessels.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted">
                      No vessels registered in company fleet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      {isEditCompModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Edit Company details</h2>
                <p className="text-[11px] text-muted mt-0.5">Modify name of this shipping company.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditCompModalOpen(false);
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

              <form onSubmit={handleEditCompany} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">COMPANY NAME</label>
                  <input
                    type="text"
                    value={editCompForm.name}
                    onChange={(e) => setEditCompForm({ ...editCompForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editCompForm.isActive}
                    onChange={(e) => setEditCompForm({ ...editCompForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="editIsActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    Is active carrier
                  </label>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditCompModalOpen(false);
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
    </>
  );
}
