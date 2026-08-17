"use client";
import { useEffect, useState } from "react";
import { getAllBerthSeafarerAllocations, createBerthSeafarerAllocation, deleteBerthSeafarerAllocation, getAllBerths, getAllIndos, getAllBerthAllocations, BerthSeafarerAllocationRequestDTO, BerthSeafarerAllocationResponseDTO, BerthResponseDTO, IndosMasterResponseDTO, BerthAllocationResponseDTO } from "@/lib/apiClient";

export default function BerthSeafarerAllocationsPage() {
  const [items, setItems] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  const [berths, setBerths] = useState<BerthResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [berthAllocations, setBerthAllocations] = useState<BerthAllocationResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BerthSeafarerAllocationRequestDTO>({ berthId: "", indosMasterId: "", startDate: "", endDate: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, b, s, ba] = await Promise.all([getAllBerthSeafarerAllocations(), getAllBerths(), getAllIndos(), getAllBerthAllocations()]);
      setItems(a); setBerths(b); setSeafarers(s); setBerthAllocations(ba);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try {
      const payload = { ...form, berthAllocationId: form.berthAllocationId || undefined };
      await createBerthSeafarerAllocation(payload);
      setForm({ berthId: "", indosMasterId: "", startDate: "", endDate: "" });
      setShowForm(false); fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this allocation?")) return;
    try { await deleteBerthSeafarerAllocation(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const berthName = (id: string) => berths.find((b) => b.id === id)?.berthName ?? id;
  const seafarerName = (id: string) => { const s = seafarers.find((s) => s.id === id); return s ? `${s.firstName} (${s.indos})` : id; };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seafarer Allocations</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Allocation"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <select value={form.berthId} onChange={(e) => setForm({ ...form, berthId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Berth</option>
            {berths.map((b) => <option key={b.id} value={b.id}>{b.berthName}</option>)}
          </select>
          <select value={form.indosMasterId} onChange={(e) => setForm({ ...form, indosMasterId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Seafarer</option>
            {seafarers.map((s) => <option key={s.id} value={s.id}>{s.firstName} ({s.indos})</option>)}
          </select>
          <select value={form.berthAllocationId ?? ""} onChange={(e) => setForm({ ...form, berthAllocationId: e.target.value || undefined })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Berth Allocation (optional)</option>
            {berthAllocations.map((ba) => <option key={ba.id} value={ba.id}>{berthName(ba.berthId)} — {new Date(ba.startDate).toLocaleDateString()}</option>)}
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
              <th className="px-4 py-2 text-left text-sm font-medium">Seafarer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Start</th>
              <th className="px-4 py-2 text-left text-sm font-medium">End</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-2 text-sm">{berthName(v.berthId)}</td>
                <td className="px-4 py-2 text-sm">{seafarerName(v.indosMasterId)}</td>
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
