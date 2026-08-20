"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllVessels,
  getAllCompanies,
  createVessel,
  toSlug,
  VesselRequestDTO,
  VesselResponseDTO,
  CompanyResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../PublicLayoutClient";

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

// Helper to register new vessel mapping in local storage
const registerVesselToCompany = (vesselId: string, companyId: string) => {
  if (typeof window !== "undefined") {
    const customMapRaw = localStorage.getItem("vessel_company_map");
    const customMap = customMapRaw ? JSON.parse(customMapRaw) : {};
    customMap[vesselId] = companyId;
    localStorage.setItem("vessel_company_map", JSON.stringify(customMap));
  }
};

export default function VesselsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);

  // Search state
  const [vesselSearch, setVesselSearch] = useState("");

  // Modals & Form
  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [vesselForm, setVesselForm] = useState<VesselRequestDTO & { companyId: string }>({
    imo: "",
    name: "",
    flag: "",
    isActive: true,
    companyId: ""
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [liveVessels, liveCompanies] = await Promise.all([
        getAllVessels(),
        getAllCompanies()
      ]);
      setVessels(liveVessels);
      setCompanies(liveCompanies);
    } catch (err: any) {
      console.error("Failed to load vessels", err);
      setError("Failed to query vessels registry records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!vesselForm.imo || !vesselForm.name || !vesselForm.flag || !vesselForm.companyId) {
      setFormError("All fields including assigned shipping company are required.");
      return;
    }

    setSaving(true);
    try {
      const newVessel = await createVessel({
        imo: vesselForm.imo.trim(),
        name: vesselForm.name.trim(),
        flag: vesselForm.flag.trim(),
        isActive: vesselForm.isActive
      });

      registerVesselToCompany(newVessel.id, vesselForm.companyId);
      setFormSuccess("Vessel registered successfully!");
      setVessels((prev) => [...prev, newVessel]);

      setTimeout(() => {
        setFormSuccess(null);
        setIsVesselModalOpen(false);
        setVesselForm({ imo: "", name: "", flag: "", isActive: true, companyId: "" });
        router.push(`/vessels/${toSlug(newVessel.name)}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to register vessel.");
    } finally {
      setSaving(false);
    }
  };

  const filteredVessels = vessels.filter((v) =>
    v.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
    v.imo.toLowerCase().includes(vesselSearch.toLowerCase())
  );

  return (
    <>
      <PublicLayoutHeader>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-ink">Fleet Vessels</h1>
          <p className="text-xs text-muted">Manage active commercial vessels, Flag State registrations, and terminal berths.</p>
        </div>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[vessels]}>
        <div className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => setIsVesselModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Register Fleet Vessel
          </button>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full">
        {loading ? (
          <div className="py-24 text-center text-sm text-muted">
            Connecting to marine fleet registry databases...
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
                    <th className="px-6 py-3.5 text-left font-semibold uppercase">Shipping Company</th>
                    <th className="px-6 py-3.5 text-left font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-xs">
                  {filteredVessels.map((v) => {
                    const comp = getVesselCompany(v, companies);
                    return (
                      <tr
                        key={v.id}
                        onClick={() => router.push(`/vessels/${toSlug(v.name)}`)}
                        className="hover:bg-surface-soft/40 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-serif text-sm text-ink">{v.name}</td>
                        <td className="px-6 py-4 font-mono text-muted">{v.imo}</td>
                        <td className="px-6 py-4 text-body-text">{v.flag}</td>
                        <td className="px-6 py-4 font-medium text-primary">
                          {comp ? comp.name : "Unassigned"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            v.isActive ? "bg-success/15 text-success" : "bg-error/15 text-error"
                          }`}>
                            {v.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredVessels.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted">
                        No fleet vessels found in directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Register Vessel Modal */}
      {isVesselModalOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-surface-card border border-hairline rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" style={{ width: "100%", maxWidth: "448px" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <div>
                <h2 className="text-lg font-serif text-ink">Register Vessel</h2>
                <p className="text-[11px] text-muted mt-0.5">Register a new fleet vessel into database.</p>
              </div>
              <button
                onClick={() => {
                  setIsVesselModalOpen(false);
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

              <form onSubmit={handleCreateVessel} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">VESSEL NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Voyager"
                    value={vesselForm.name}
                    onChange={(e) => setVesselForm({ ...vesselForm, name: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">IMO NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. IMO9123456"
                    value={vesselForm.imo}
                    onChange={(e) => setVesselForm({ ...vesselForm, imo: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">FLAG STATE</label>
                  <input
                    type="text"
                    placeholder="e.g. Singapore"
                    value={vesselForm.flag}
                    onChange={(e) => setVesselForm({ ...vesselForm, flag: e.target.value })}
                    className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-body-strong">ASSIGN SHIPPING COMPANY</label>
                  <select
                    value={vesselForm.companyId}
                    onChange={(e) => setVesselForm({ ...vesselForm, companyId: e.target.value })}
                    className="w-full text-input px-3 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                    style={{ height: "40px" }}
                  >
                    <option value="">-- Choose Carrier --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="vesselIsActive"
                    checked={vesselForm.isActive}
                    onChange={(e) => setVesselForm({ ...vesselForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="vesselIsActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
                    Is active vessel
                  </label>
                </div>

                <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVesselModalOpen(false);
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
                    {saving ? "Registering..." : "Register Vessel"}
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
