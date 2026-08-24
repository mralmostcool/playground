"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getContract,
  getIndos,
  getAllCompanies,
  getAllBerthSeafarerAllocations,
  getAllBerthAllocations,
  getAllBerths,
  getAllVessels,
  updateContract,
  deleteContract,
  toSlug,
  ContractResponseDTO,
  IndosMasterResponseDTO,
  CompanyResponseDTO,
  BerthSeafarerAllocationResponseDTO,
  BerthAllocationResponseDTO,
  BerthResponseDTO,
  VesselResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
import {
  PageHeader,
  LoadingSkeleton,
  EmptyState,
  Modal,
  ConfirmDialog,
  StatusBadge,
  InfoRow,
  useToast
} from "@/components/ui";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const contractId = params.contractId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core entities
  const [contract, setContract] = useState<ContractResponseDTO | null>(null);
  const [seafarer, setSeafarer] = useState<IndosMasterResponseDTO | null>(null);
  const [company, setCompany] = useState<CompanyResponseDTO | null>(null);
  const [vessel, setVessel] = useState<VesselResponseDTO | null>(null);
  const [berth, setBerth] = useState<BerthResponseDTO | null>(null);

  // Sign On / Sign Off states
  const [actionType, setActionType] = useState<"signon" | "signoff" | null>(null);
  const [actionForm, setActionForm] = useState({
    date: new Date().toISOString().split("T")[0],
    port: "",
    country: ""
  });

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cData = await getContract(contractId);
      setContract(cData);

      const [
        sData,
        allComps,
        allBSAllocs,
        allBAllocs,
        allBerths,
        allVessels
      ] = await Promise.all([
        getIndos(cData.indosMasterId),
        getAllCompanies(),
        getAllBerthSeafarerAllocations(),
        getAllBerthAllocations(),
        getAllBerths(),
        getAllVessels()
      ]);

      setSeafarer(sData);
      setCompany(allComps.find(x => x.id === cData.companyId) || null);

      // Resolve Vessel and Berth Name from Allocations
      const bsAlloc = allBSAllocs.find(a => a.id === cData.berthSeafarerAllocationId);
      if (bsAlloc) {
        const b = allBerths.find(x => x.id === bsAlloc.berthId);
        if (b) setBerth(b);

        const bAlloc = allBAllocs.find(a => a.id === bsAlloc.berthAllocationId);
        if (bAlloc) {
          const v = allVessels.find(x => x.id === bAlloc.vesselId);
          if (v) setVessel(v);
        }
      }
    } catch (err: any) {
      console.error("Failed to load contract details", err);
      setError("Failed to query contract record from registry.");
      toast("Error loading contract details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId) {
      loadData();
    }
  }, [contractId]);

  const handleContractActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !actionType) return;

    if (!actionForm.port.trim() || !actionForm.country.trim()) {
      toast("Port and country are required.", "warning");
      return;
    }

    setSaving(true);
    try {
      const updatedPayload = { ...contract };
      if (actionType === "signon") {
        updatedPayload.actualSignOnDate = actionForm.date + "T00:00:00Z";
        updatedPayload.actualSignOnPort = actionForm.port.trim();
        updatedPayload.actualSignOnCountry = actionForm.country.trim();
        updatedPayload.status = "ACTIVE";
      } else {
        updatedPayload.actualSignOffDate = actionForm.date + "T00:00:00Z";
        updatedPayload.actualSignOffPort = actionForm.port.trim();
        updatedPayload.actualSignOffCountry = actionForm.country.trim();
        updatedPayload.status = "COMPLETED";
      }

      await updateContract(contract.id, updatedPayload);
      toast(actionType === "signon" ? "Sign-On recorded successfully." : "Sign-Off recorded successfully.", "success");
      setActionType(null);
      await loadData();
    } catch (err: any) {
      toast(err.message || "Failed to log event.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!contract) return;
    try {
      await deleteContract(contract.id);
      toast("Contract cancelled/deleted successfully.", "success");
      if (seafarer) {
        router.push(`/seafarer/${seafarer.indos}`);
      } else {
        router.push("/seafarer");
      }
    } catch (err: any) {
      toast(err.message || "Failed to delete contract.", "error");
    }
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !contract) {
    return (
      <EmptyState
        message={error || "Contract details could not be resolved."}
        title="Contract Registry Error"
        ctaLabel="Back to Seafarers"
        onCtaClick={() => router.push("/seafarer")}
      />
    );
  }

  return (
    <>
      <PublicLayoutHeader deps={[contract.id, contract.status]}>
        <PageHeader
          title={`Contract Agreement`}
          subtitle={`Seafarer: ${seafarer?.firstName || "—"} | Vessel: ${vessel?.name || "—"}`}
          backHref={seafarer ? `/seafarer/${seafarer.indos}` : "/seafarer"}
          backLabel="Back to Profile"
        >
          <StatusBadge status={contract.status || "DRAFT"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[contract.status]}>
        <div className="flex flex-col gap-6 mt-4 font-sans text-xs text-muted">
          <div className="bg-surface-soft border border-hairline rounded-lg p-5 flex flex-col gap-4">
            <h4 className="font-semibold text-body-strong">Contract Actions</h4>
            <div className="flex flex-col gap-2">
              {contract.status !== "COMPLETED" && contract.status !== "TERMINATED" && (
                <>
                  {!contract.actualSignOnDate && (
                    <button
                      onClick={() => {
                        setActionType("signon");
                        setActionForm({
                          date: new Date().toISOString().split("T")[0],
                          port: contract.signOnPort,
                          country: contract.signOnCountry
                        });
                      }}
                      className="w-full h-9 bg-primary text-on-primary font-medium text-xs rounded-md hover:bg-primary-active flex items-center justify-center transition-colors cursor-pointer"
                    >
                      Record actual Sign-On
                    </button>
                  )}
                  {contract.actualSignOnDate && !contract.actualSignOffDate && (
                    <button
                      onClick={() => {
                        setActionType("signoff");
                        setActionForm({
                          date: new Date().toISOString().split("T")[0],
                          port: contract.signOffPort,
                          country: contract.signOffCountry
                        });
                      }}
                      className="w-full h-9 bg-success text-on-primary font-medium text-xs rounded-md hover:bg-success/90 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      Record actual Sign-Off
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="w-full h-9 bg-error/10 text-error font-medium text-xs rounded-md hover:bg-error/20 border border-error/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                Cancel / Delete Contract
              </button>
            </div>
          </div>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-surface-card border border-hairline rounded-lg p-6 flex flex-col gap-6 font-sans text-xs max-w-2xl">
        <div>
          <h3 className="text-lg font-serif text-ink mb-1">Contract Agreement Ledger</h3>
          <p className="text-xs text-muted">Audited sea service deployment terms.</p>
        </div>

        <div className="flex flex-col border border-hairline rounded-lg p-4 bg-canvas">
          <InfoRow label="Shipping Company Carrier" value={company?.name} />
          <InfoRow label="Vessel Assigned" value={vessel?.name} />
          <InfoRow label="Vessel IMO" value={vessel?.imo} />
          <InfoRow label="Vessel Flag State" value={vessel?.flag} />
          <InfoRow label="Vessel Training Berth" value={berth?.berthName} />
          <InfoRow label="Contract Status" value={<StatusBadge status={contract.status || "DRAFT"} />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="border border-hairline rounded-lg p-4 bg-canvas flex flex-col">
            <h4 className="font-semibold text-muted text-[10px] uppercase mb-2">Planned Schedule Coordinates</h4>
            <InfoRow label="Sign-On date" value={contract.signOnDate.split("T")[0]} />
            <InfoRow label="Sign-On port" value={`${contract.signOnPort}, ${contract.signOnCountry}`} />
            <InfoRow label="Sign-Off date" value={contract.signOffDate.split("T")[0]} />
            <InfoRow label="Sign-Off port" value={`${contract.signOffPort}, ${contract.signOffCountry}`} />
          </div>

          <div className="border border-hairline rounded-lg p-4 bg-canvas flex flex-col">
            <h4 className="font-semibold text-muted text-[10px] uppercase mb-2">Actual Registry Logs</h4>
            <InfoRow
              label="Sign-On date"
              value={contract.actualSignOnDate ? contract.actualSignOnDate.split("T")[0] : <span className="text-muted italic">Pending</span>}
            />
            <InfoRow
              label="Sign-On port"
              value={contract.actualSignOnPort ? `${contract.actualSignOnPort}, ${contract.actualSignOnCountry}` : <span className="text-muted italic">Pending</span>}
            />
            <InfoRow
              label="Sign-Off date"
              value={contract.actualSignOffDate ? contract.actualSignOffDate.split("T")[0] : <span className="text-muted italic">Pending</span>}
            />
            <InfoRow
              label="Sign-Off port"
              value={contract.actualSignOffPort ? `${contract.actualSignOffPort}, ${contract.actualSignOffCountry}` : <span className="text-muted italic">Pending</span>}
            />
          </div>
        </div>

        {contract.remarks && (
          <div className="border border-hairline rounded-lg p-4 bg-canvas mt-4">
            <span className="font-semibold text-muted text-[10px] uppercase block mb-1">Contract Remarks / Deck Duties</span>
            <p className="text-body-text">{contract.remarks}</p>
          </div>
        )}
      </div>

      {/* Record Sign On / Sign Off Modal */}
      {actionType && (
        <Modal
          isOpen={true}
          onClose={() => setActionType(null)}
          title={actionType === "signon" ? "Record Actual Sign-On" : "Record Actual Sign-Off"}
          subtitle="Log sea training actual event."
        >
          <form onSubmit={handleContractActionSubmit} className="flex flex-col gap-4 text-xs font-sans">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">EVENT DATE</label>
              <input
                type="date"
                value={actionForm.date}
                onChange={(e) => setActionForm({ ...actionForm, date: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">PORT CITY</label>
              <input
                type="text"
                value={actionForm.port}
                onChange={(e) => setActionForm({ ...actionForm, port: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-body-strong">PORT COUNTRY</label>
              <input
                type="text"
                value={actionForm.country}
                onChange={(e) => setActionForm({ ...actionForm, country: e.target.value })}
                className="w-full text-input px-3.5 bg-canvas border border-muted focus:border-primary rounded-md outline-none text-sm"
                style={{ height: "40px" }}
              />
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="h-10 px-4 bg-surface-soft text-body-strong font-medium rounded-md hover:bg-surface-cream-strong border border-hairline inline-flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 px-5 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active inline-flex items-center justify-center text-xs transition-colors cursor-pointer font-semibold"
              >
                {saving ? "Submitting..." : "Submit Event Log"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete / Cancel Contract Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteContract}
        title="Cancel Contract Agreement"
        message="Are you sure you want to cancel and delete this seafarer sea training contract agreement registry? This action is irreversible."
        confirmLabel="Confirm Deletion"
        isDestructive={true}
      />
    </>
  );
}
