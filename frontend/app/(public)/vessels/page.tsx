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
  CompanyResponseDTO,
  getVesselCompanyId,
  registerVesselToCompany
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

export default function VesselsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);

  // Search and Filter States
  const [vesselSearch, setVesselSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");

  // Modals & Form
  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [vesselForm, setVesselForm] = useState<VesselRequestDTO & { companyId: string }>({
    imo: "",
    name: "",
    flag: "",
    isActive: true,
    companyId: ""
  });

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
      toast("Error loading fleet vessels directory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateVessel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vesselForm.imo || !vesselForm.name || !vesselForm.flag || !vesselForm.companyId) {
      toast("All fields including assigned shipping company are required.", "warning");
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
      toast("Vessel registered successfully!", "success");
      setVessels((prev) => [...prev, newVessel]);
      setVesselForm({ imo: "", name: "", flag: "", isActive: true, companyId: "" });
      setIsVesselModalOpen(false);
      router.push(`/vessels/${toSlug(newVessel.name)}`);
    } catch (err: any) {
      toast(err.message || "Failed to register vessel.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getVesselCompany = (vessel: VesselResponseDTO) => {
    const compId = getVesselCompanyId(vessel.id, vessel.name, companies);
    return companies.find(c => c.id === compId) || null;
  };

  // Unique flags list
  const flags = Array.from(new Set(vessels.map(v => v.flag).filter(Boolean)));

  const filteredVessels = vessels.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
      v.imo.toLowerCase().includes(vesselSearch.toLowerCase());

    const comp = getVesselCompany(v);
    const matchesCompany = selectedCompanyId ? comp?.id === selectedCompanyId : true;
    const matchesFlag = selectedFlag ? v.flag === selectedFlag : true;

    return matchesSearch && matchesCompany && matchesFlag;
  });

  return (
    <>
      <PublicLayoutHeader>
        <PageHeader
          title="Fleet Vessels"
          subtitle="Manage active commercial vessels, Flag State registrations, and terminal berths."
        />
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[vessels.length]}>
        <div className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => setIsVesselModalOpen(true)}
            className="w-full h-10 bg-primary text-on-primary font-medium text-xs tracking-wide uppercase rounded-md hover:bg-primary-active flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Fleet Vessel
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <SearchBar
                  placeholder="Search fleet vessels by name or IMO..."
                  value={vesselSearch}
                  onChange={setVesselSearch}
                />
              </div>

              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="h-10 text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm w-full md:w-48"
              >
                <option value="">Filter by Carrier (All)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedFlag}
                onChange={(e) => setSelectedFlag(e.target.value)}
                className="h-10 text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm w-full md:w-48"
              >
                <option value="">Filter by Flag (All)</option>
                {flags.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {filteredVessels.length === 0 ? (
              <EmptyState message="No fleet vessels registered matching criteria." title="No Vessels" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Vessel Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">IMO Number</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Flag State</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Shipping Company</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredVessels.map((v) => {
                      const comp = getVesselCompany(v);
                      return (
                        <tr
                          key={v.id}
                          onClick={() => router.push(`/vessels/${toSlug(v.name)}`)}
                          className="hover:bg-surface-soft/40 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3.5 font-serif text-sm font-semibold text-body-strong">{v.name}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{v.imo}</td>
                          <td className="px-4 py-3.5 text-body-text">{v.flag}</td>
                          <td className="px-4 py-3.5 font-medium text-primary">
                            {comp ? comp.name : "Unassigned"}
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={v.isActive ? "true" : "false"} />
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

      {/* Register Vessel Modal */}
      <Modal
        isOpen={isVesselModalOpen}
        onClose={() => setIsVesselModalOpen(false)}
        title="Register Vessel"
        subtitle="Register a new fleet vessel into database."
      >
        <form onSubmit={handleCreateVessel} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">VESSEL REGISTER NAME</label>
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
            <label className="text-xs font-semibold text-body-strong">IMO REGISTRY NUMBER</label>
            <input
              type="text"
              placeholder="e.g. IMO9123456"
              maxLength={10}
              value={vesselForm.imo}
              onChange={(e) => setVesselForm({ ...vesselForm, imo: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">FLAG STATE REGISTRY</label>
            <input
              type="text"
              placeholder="e.g. Panama"
              value={vesselForm.flag}
              onChange={(e) => setVesselForm({ ...vesselForm, flag: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">ASSIGNED SHIPPING CARRIER</label>
            <select
              value={vesselForm.companyId}
              onChange={(e) => setVesselForm({ ...vesselForm, companyId: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            >
              <option value="">Select Shipping Carrier Partner</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="new-vessel-isActive"
              checked={vesselForm.isActive}
              onChange={(e) => setVesselForm({ ...vesselForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="new-vessel-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE SERVICE REGISTERED
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsVesselModalOpen(false)}
              className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer disabled:opacity-50 font-semibold"
            >
              {saving ? "Registering..." : "Save Vessel"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
