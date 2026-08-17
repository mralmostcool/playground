"use client";
import { useEffect, useState } from "react";
import { getAllBerthAllocations, createBerthAllocation, deleteBerthAllocation, getAllBerths, getAllVessels, BerthAllocationRequestDTO, BerthAllocationResponseDTO, BerthResponseDTO, VesselResponseDTO } from "@/lib/apiClient";

export default function BerthAllocationsPage() {
  const [items, setItems] = useState<BerthAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BerthAllocationRequestDTO>({ berthId: "", vesselId: "", startDate: "", endDate: "" });

  const fetchData = async () => { setLoading(true); try { const [a, b, v] = await Promise.all([getAllBerthAllocations(), getAllBerths(), getAllVessels()]); setItems(a); setBerths(b); setVessels(v); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try { await createBerthAllocation(form); setForm({ berthId: "", vesselId: "", startDate: "", endDate: "" }); setShowForm(false); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this allocation?")) return;
    try { await deleteBerthAllocation(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const berthName = (id: string) => berths.find((b) => b.id === id)?.berthName ?? id;
  const vesselName = (id: string) => { const v = vessels.find((v) => v.id === id); return v ? `${v.name} (${v.imo})` : id; };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Berth Allocations</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Allocation"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <select value={form.berthId} onChange={(e) => setForm({ ...form, berthId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Berth</option>
            {berths.map((b) => <option key={b.id} value={b.id}>{b.berthName}</option>)}
          </select>
          <select value={form.vesselId} onChange={(e) => setForm({ ...form, vesselId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Vessel</option>
            {vessels.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.imo})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
          </div>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Berth</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Vessel</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Start</th>
              <th className="px-4 py-2 text-left text-sm font-medium">End</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-2 text-sm">{berthName(v.berthId)}</td>
                <td className="px-4 py-2 text-sm">{vesselName(v.vesselId)}</td>
                <td className="px-4 py-2 text-sm">{new Date(v.startDate).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm">{new Date(v.endDate).toLocaleString()}</td>
                <td className="px-4 py-2"><button onClick={() => handleDelete(v.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
