"use client";
import { useEffect, useState } from "react";
import { getAllBerths, createBerth, deleteBerth, BerthRequestDTO, BerthResponseDTO } from "@/lib/apiClient";

export default function BerthsPage() {
  const [items, setItems] = useState<BerthResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BerthRequestDTO>({ berthName: "", isActive: true });

  const fetchData = async () => { setLoading(true); try { setItems(await getAllBerths()); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try { await createBerth(form); setForm({ berthName: "", isActive: true }); setShowForm(false); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this berth?")) return;
    try { await deleteBerth(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Berths</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Berth"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <input placeholder="Berth Name" value={form.berthName} onChange={(e) => setForm({ ...form, berthName: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Active</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-2 text-sm">{v.berthName}</td>
                <td className="px-4 py-2 text-sm">{v.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-sm">{new Date(v.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2"><button onClick={() => handleDelete(v.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
