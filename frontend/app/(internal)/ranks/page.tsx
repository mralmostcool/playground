"use client";
import { useEffect, useState } from "react";
import { getAllRanks, createRank, deleteRank, RankMasterRequestDTO, RankMasterResponseDTO } from "@/lib/apiClient";

export default function RanksPage() {
  const [items, setItems] = useState<RankMasterResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RankMasterRequestDTO>({ name: "", level: 0 });

  const fetchData = async () => { setLoading(true); try { setItems(await getAllRanks()); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try { await createRank({ ...form, level: Number(form.level) }); setForm({ name: "", level: 0 }); setShowForm(false); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rank?")) return;
    try { await deleteRank(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ranks</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Rank"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input placeholder="Level" type="number" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Level</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-2 text-sm">{v.name}</td>
                <td className="px-4 py-2 text-sm">{v.level}</td>
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
