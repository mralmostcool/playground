"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllBerths,
  getAllBerthAllocations,
  getAllBerthSeafarerAllocations,
  getAllVessels,
  getAllIndos,
  toSlug,
  BerthResponseDTO,
  BerthAllocationResponseDTO,
  BerthSeafarerAllocationResponseDTO,
  VesselResponseDTO,
  IndosMasterResponseDTO
} from "@/lib/apiClient";
import { PublicLayoutHeader, PublicLayoutSidebar } from "../../PublicLayoutClient";
import {
  PageHeader,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  TabBar,
  InfoRow,
  useToast
} from "@/components/ui";

type TabId = "vessels" | "trainees";

export default function BerthDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const berthNameSlug = params.berthName as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core entities
  const [berth, setBerth] = useState<BerthResponseDTO | null>(null);
  const [vesselAllocations, setVesselAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [seafarerAllocations, setSeafarerAllocations] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  
  // Collections for resolving details
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabId>("vessels");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        allBerths,
        allAllocations,
        allBSAllocations,
        allVessels,
        allSeafarers
      ] = await Promise.all([
        getAllBerths(),
        getAllBerthAllocations(),
        getAllBerthSeafarerAllocations(),
        getAllVessels(),
        getAllIndos()
      ]);

      const foundBerth = allBerths.find((b) => toSlug(b.berthName) === berthNameSlug);
      if (!foundBerth) {
        setError("Berth record not found.");
        return;
      }

      setBerth(foundBerth);
      setVessels(allVessels);
      setSeafarers(allSeafarers);

      // Filter allocations for this berth
      setVesselAllocations(allAllocations.filter((a) => a.berthId === foundBerth.id));
      setSeafarerAllocations(allBSAllocations.filter((a) => a.berthId === foundBerth.id));
    } catch (err: any) {
      console.error("Failed to load berth details", err);
      setError("Failed to query berth records from registry.");
      toast("Error loading berth allocation logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (berthNameSlug) {
      loadData();
    }
  }, [berthNameSlug]);

  const getVesselName = (vesselId: string) => {
    return vessels.find((v) => v.id === vesselId)?.name ?? "Unknown Vessel";
  };

  const getSeafarerInfo = (seafarerId: string) => {
    return seafarers.find((s) => s.id === seafarerId);
  };

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  if (error || !berth) {
    return (
      <EmptyState
        message={error || "Berth details could not be resolved."}
        title="Berth Registry Error"
        ctaLabel="Back to Berths"
        onCtaClick={() => router.push("/berths")}
      />
    );
  }

  return (
    <>
      <PublicLayoutHeader deps={[berth.id, berth.berthName, berth.isActive]}>
        <PageHeader
          title={berth.berthName}
          subtitle="Vessel training berth allocation timeline and occupancy ledger."
          backHref="/berths"
          backLabel="Back to Berths"
        >
          <StatusBadge status={berth.isActive ? "true" : "false"} />
        </PageHeader>
      </PublicLayoutHeader>

      <PublicLayoutSidebar deps={[activeTab]}>
        <div className="flex flex-col gap-6 mt-4 font-sans text-xs text-muted leading-relaxed">
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("vessels")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "vessels"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Vessel Allocations
            </button>
            <button
              onClick={() => setActiveTab("trainees")}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all cursor-pointer ${
                activeTab === "trainees"
                  ? "bg-surface-card text-primary font-semibold border-l-2 border-primary"
                  : "text-muted hover:text-ink hover:bg-surface-soft/40"
              }`}
            >
              Trainee Occupancy
            </button>
          </nav>
        </div>
      </PublicLayoutSidebar>

      <div className="bg-canvas w-full font-sans">
        <TabBar
          tabs={[
            { id: "vessels", label: "Fleet Vessel Assignments" },
            { id: "trainees", label: "Trainee Occupancy Ledger" }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "vessels" && (
          <div className="flex flex-col gap-6">
            {vesselAllocations.length === 0 ? (
              <EmptyState message="No vessels are currently allocated to this training berth." title="No Vessel Assignments" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Vessel Name</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Allocation Start Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Allocation End Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Window Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {vesselAllocations.map((a) => {
                      const now = Date.now();
                      const startMs = new Date(a.startDate).getTime();
                      const endMs = new Date(a.endDate).getTime();
                      const isCurrent = now >= startMs && now <= endMs;

                      return (
                        <tr key={a.id} className="hover:bg-surface-soft/25 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-body-strong">
                            <Link href={`/vessels/${toSlug(getVesselName(a.vesselId))}`} className="text-primary hover:underline">
                              {getVesselName(a.vesselId)}
                            </Link>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.startDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.endDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                            }`}>
                              {isCurrent ? "Active Allocation" : "Expired / Scheduled"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "trainees" && (
          <div className="flex flex-col gap-6">
            {seafarerAllocations.length === 0 ? (
              <EmptyState message="No seafarer trainees have been allocated to this berth." title="No Trainee Records" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-canvas border border-hairline rounded-lg overflow-hidden text-xs">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-muted">
                      <th className="px-4 py-3 text-left font-semibold uppercase">Trainee Candidate</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">INDOS ID</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Occupancy Start Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Occupancy End Date</th>
                      <th className="px-4 py-3 text-left font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {seafarerAllocations.map((a) => {
                      const s = getSeafarerInfo(a.indosMasterId);
                      if (!s) return null;

                      const now = Date.now();
                      const startMs = new Date(a.startDate).getTime();
                      const endMs = new Date(a.endDate).getTime();
                      const isCurrent = now >= startMs && now <= endMs;

                      return (
                        <tr key={a.id} className="hover:bg-surface-soft/25 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-body-strong">
                            <Link href={`/seafarer/${s.indos}`} className="text-primary hover:underline">
                              {s.firstName}
                            </Link>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted">{s.indos}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.startDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5 font-mono text-muted">{a.endDate.split("T")[0]}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                            }`}>
                              {isCurrent ? "Active Duty" : "Completed / Future"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
