"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getAllVessels,
  createVessel,
  updateCompany,
  deleteCompany,
  getAllBerthAllocations,
  getAllBerthSeafarerAllocations,
  getAllBerths,
  getAllIndos,
  toSlug,
  CompanyResponseDTO,
  VesselResponseDTO,
  VesselRequestDTO,
  CompanyRequestDTO,
  BerthAllocationResponseDTO,
  BerthSeafarerAllocationResponseDTO,
  BerthResponseDTO,
  IndosMasterResponseDTO,
  getVesselCompanyId,
  registerVesselToCompany
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

type TabId = "vessels" | "berths";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const companySlug = params.companySlug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collections
  const [company, setCompany] = useState<CompanyResponseDTO | null>(null);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [allCompaniesList, setAllCompaniesList] = useState<CompanyResponseDTO[]>([]);
  const [allVesselsList, setAllVesselsList] = useState<VesselResponseDTO[]>([]);

  // Operational collections for berths tab
  const [berthAllocations, setBerthAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [berthSeafarerAllocations, setBerthSeafarerAllocations] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Search & Navigation
  const [vesselSearch, setVesselSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("vessels");

  const [isEditCompModalOpen, setIsEditCompModalOpen] = useState(false);
  const [editCompForm, setEditCompForm] = useState<CompanyRequestDTO>({
    name: "",
    isActive: true
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Add Vessel Form Modal
  const [isAddVesselModalOpen, setIsAddVesselModalOpen] = useState(false);
  const [vesselForm, setVesselForm] = useState<VesselRequestDTO>({
    imo: "",
    name: "",
    flag: "",
    isActive: true
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        allComps,
        allVessels,
        allBAllocations,
        allBSAllocations,
        allBerths,
        allSeafarers
      ] = await Promise.all([
        getAllCompanies(),
        getAllVessels(),
        getAllBerthAllocations(),
        getAllBerthSeafarerAllocations(),
        getAllBerths(),
        getAllIndos()
      ]);

      const foundComp = allComps.find((c) => toSlug(c.name) === companySlug);
      if (!foundComp) {
        setError("Shipping company record not found.");
        return;
      }

      setCompany(foundComp);
      setAllCompaniesList(allComps);
      setAllVesselsList(allVessels);
      setEditCompForm({ name: foundComp.name, isActive: foundComp.isActive });

      const compVessels = allVessels.filter((v) => getVesselCompanyId(v.id, v.name, allComps) === foundComp.id);
      setVessels(compVessels);

      setBerthAllocations(allBAllocations);
      setBerthSeafarerAllocations(allBSAllocations);
      setBerths(allBerths);
      setSeafarers(allSeafarers);
    } catch (err: any) {
      console.error("Failed to query company details", err);
      setError("Failed to query registry database for this shipping company.");
      toast("Error loading company records", "error");
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

    if (!editCompForm.name.trim()) {
      toast("Company name is required.", "warning");
      return;
    }

    setSaving(true);
    try {
      await updateCompany(company.id, {
        name: editCompForm.name.trim(),
        registrationNo: company.registrationNo,
        isActive: editCompForm.isActive
      });
      toast("Company updated successfully.", "success");
      const newSlug = toSlug(editCompForm.name.trim());
      setIsEditCompModalOpen(false);
      router.push(`/companies/${newSlug}`);
    } catch (err: any) {
      toast(err.message || "Failed to update shipping company.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!company) return;
    try {
      await deleteCompany(company.id);
      toast("Shipping carrier registry deleted.", "success");
      router.push("/companies");
    } catch (err: any) {
      toast(err.message || "Failed to delete company.", "error");
    }
  };

  const handleCreateVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    if (!vesselForm.imo || !vesselForm.name || !vesselForm.flag) {
      toast("All fields are required.", "warning");
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

      registerVesselToCompany(newVessel.id, company.id);
      toast("Vessel registered successfully in company fleet!", "success");
      setVessels((prev) => [...prev, newVessel]);
      setVesselForm({ imo: "", name: "", flag: "", isActive: true });
      setIsAddVesselModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to register vessel.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !company) {
    return (
      <EmptyState
        message={error || "Shipping company details could not be resolved."}
        title="Company Profile Error"
        ctaLabel="Back to Companies"
        onCtaClick={() => router.push("/companies")}
      />
    );
  }

  const filteredVessels = vessels.filter((v) =>
    v.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
    v.imo.toLowerCase().includes(vesselSearch.toLowerCase())
  );

  // Filter berth allocations for company's vessels
  const companyVesselIds = vessels.map(v => v.id);
  const companyBerthAllocations = berthAllocations.filter(alloc =>
    companyVesselIds.includes(alloc.vesselId)
  );

  const getVesselName = (vesselId: string) => {
    return vessels.find(v => v.id === vesselId)?.name ?? "Unknown Vessel";
  };

  const getBerthName = (berthId: string) => {
    return berths.find(b => b.id === berthId)?.berthName ?? "Unknown Berth";
  };

  const getSeafarerNameOnBerth = (berthId: string, allocId: string) => {
    const sAlloc = berthSeafarerAllocations.find(sa => sa.berthId === berthId && sa.berthAllocationId === allocId);
    if (!sAlloc) return "Empty";
    const s = seafarers.find(x => x.id === sAlloc.indosMasterId);
    return s ? `${s.firstName} (${s.indos})` : "Assigned";
  };

  return (
    <>
      <PublicLayoutHeader deps={[company.id, company.name, company.isActive]}>
        <PageHeader
          title={company.name}
          subtitle={`REG: ${company.registrationNo || "—"}`}
          backHref="/companies"
          backLabel="Back to Companies"
        >
          <StatusBadge status={company.isActive ? "true" : "false"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-1.5 font-sans">
            <button
              onClick={() => setActiveTab("vessels")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "vessels"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Company Fleet
            </button>
            <button
              onClick={() => setActiveTab("berths")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "berths"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Berth Schedule
            </button>
          </nav>

          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4 font-sans">
            <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">Company Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditCompModalOpen(true)}
                className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
              >
                Edit Company Name
              </button>
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        <TabBar
          tabs={[
            { id: "vessels", label: "Registered Fleet" },
            { id: "berths", label: "Allocated Berths" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "vessels" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-grow">
                <SearchBar
                  placeholder="Search fleet vessels by name or IMO..."
                  value={vesselSearch}
                  onChange={setVesselSearch}
                />
              </div>
              <button
                onClick={() => setIsAddVesselModalOpen(true)}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs tracking-wide uppercase transition-colors cursor-pointer flex-shrink-0"
              >
                Register Vessel
              </button>
            </div>

            {filteredVessels.length === 0 ? (
              <EmptyState message="No fleet vessels registered for this company carrier." title="No Vessels Registered" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Vessel Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">IMO Number</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Flag State</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredVessels.map((v) => (
                      <tr
                        key={v.id}
                        onClick={() => router.push(`/vessels/${toSlug(v.name)}`)}
                        className="cursor-pointer hover:bg-surface-soft/40 transition-colors"
                      >
                        <td className="px-4 py-3.5 font-serif text-sm font-semibold text-body-strong">{v.name}</td>
                        <td className="px-4 py-3.5 font-mono text-muted">{v.imo}</td>
                        <td className="px-4 py-3.5 text-body-text">{v.flag}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={v.isActive ? "true" : "false"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "berths" && (
          <div className="flex flex-col gap-6">
            {companyBerthAllocations.length === 0 ? (
              <EmptyState message="No allocated training berths detected for vessels in this fleet." title="No Berth Allocations" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Berth Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Assigned Vessel</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Trainee Slot Status</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Allocation Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {companyBerthAllocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-surface-soft/20 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-body-strong">
                          {getBerthName(alloc.berthId)}
                        </td>
                        <td className="px-4 py-3.5 text-body-text">
                          {getVesselName(alloc.vesselId)}
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          {getSeafarerNameOnBerth(alloc.berthId, alloc.id)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted">
                          {alloc.startDate.split("T")[0]} &rarr; {alloc.endDate.split("T")[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Company details Modal */}
      <Modal
        isOpen={isEditCompModalOpen}
        onClose={() => setIsEditCompModalOpen(false)}
        title="Edit Company details"
        subtitle="Modify register name of this shipping company carrier."
      >
        <form onSubmit={handleEditCompany} className="flex flex-col gap-4 text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-body-strong">COMPANY CARRIER NAME</label>
            <input
              type="text"
              value={editCompForm.name}
              onChange={(e) => setEditCompForm({ ...editCompForm, name: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="edit-carrier-isActive"
              checked={editCompForm.isActive}
              onChange={(e) => setEditCompForm({ ...editCompForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="edit-carrier-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE SHIPPING CARRIER
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsEditCompModalOpen(false)}
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

      {/* Register Vessel Modal */}
      <Modal
        isOpen={isAddVesselModalOpen}
        onClose={() => setIsAddVesselModalOpen(false)}
        title="Register Fleet Vessel"
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
              placeholder="e.g. Singapore"
              value={vesselForm.flag}
              onChange={(e) => setVesselForm({ ...vesselForm, flag: e.target.value })}
              className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="vessel-isActive"
              checked={vesselForm.isActive}
              onChange={(e) => setVesselForm({ ...vesselForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="vessel-isActive" className="text-xs font-semibold text-body-strong cursor-pointer select-none">
              ACTIVE SERVICE REGISTERED
            </label>
          </div>

          <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsAddVesselModalOpen(false)}
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

      {/* Delete Company Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteCompany}
        title="Confirm Shipping Carrier Deletion"
        message="Are you sure you want to delete this shipping company carrier profile? This will clear all fleet list and berths allocations records permanently."
        confirmLabel="Delete permanently"
        isDestructive={true}
      />
    </>
  );
}
