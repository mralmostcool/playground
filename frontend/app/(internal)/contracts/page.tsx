"use client";
import { useEffect, useState } from "react";
import {
  getAllContracts, createContract, deleteContract,
  getAllIndos, getAllCompanies, getAllEnrollments, getAllBerthSeafarerAllocations,
  ContractRequestDTO, ContractResponseDTO,
  IndosMasterResponseDTO, CompanyResponseDTO, EnrollmentResponseDTO, BerthSeafarerAllocationResponseDTO,
} from "@/lib/apiClient";

const empty: ContractRequestDTO = {
  indosMasterId: "", companyId: "", enrollmentId: "", berthSeafarerAllocationId: "",
  signOnDate: "", signOnPort: "", signOnCountry: "",
  signOffDate: "", signOffPort: "", signOffCountry: "",
  remarks: "",
};

export default function ContractsPage() {
  const [items, setItems] = useState<ContractResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponseDTO[]>([]);
  const [allocations, setAllocations] = useState<BerthSeafarerAllocationResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ContractRequestDTO>(empty);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, s, co, e, a] = await Promise.all([
        getAllContracts(), getAllIndos(), getAllCompanies(), getAllEnrollments(), getAllBerthSeafarerAllocations(),
      ]);
      setItems(c); setSeafarers(s); setCompanies(co); setEnrollments(e); setAllocations(a);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try { await createContract(form); setForm(empty); setShowForm(false); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contract?")) return;
    try { await deleteContract(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const seafarerLabel = (id: string) => { const s = seafarers.find((s) => s.id === id); return s ? `${s.firstName} (${s.indos})` : id; };
  const companyLabel = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  const inputCls = "w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100";
  const selectCls = inputCls;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Contract"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select value={form.indosMasterId} onChange={(e) => setForm({ ...form, indosMasterId: e.target.value })} className={selectCls}>
              <option value="">Select Seafarer</option>
              {seafarers.map((s) => <option key={s.id} value={s.id}>{s.firstName} ({s.indos})</option>)}
            </select>
            <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className={selectCls}>
              <option value="">Select Company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.enrollmentId} onChange={(e) => setForm({ ...form, enrollmentId: e.target.value })} className={selectCls}>
              <option value="">Select Enrollment</option>
              {enrollments.filter((e) => e.status === "COMPLETED").map((e) => <option key={e.id} value={e.id}>{seafarerLabel(e.indosMasterId)} — {e.status}</option>)}
            </select>
            <select value={form.berthSeafarerAllocationId} onChange={(e) => setForm({ ...form, berthSeafarerAllocationId: e.target.value })} className={selectCls}>
              <option value="">Select Seafarer Allocation</option>
              {allocations.map((a) => <option key={a.id} value={a.id}>{seafarerLabel(a.indosMasterId)} — {new Date(a.startDate).toLocaleDateString()}</option>)}
            </select>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 pt-2">Planned Sign On</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">Date</label><input type="datetime-local" value={form.signOnDate} onChange={(e) => setForm({ ...form, signOnDate: e.target.value })} className={inputCls} /></div>
            <input placeholder="Port" value={form.signOnPort} onChange={(e) => setForm({ ...form, signOnPort: e.target.value })} className={inputCls} />
            <input placeholder="Country" value={form.signOnCountry} onChange={(e) => setForm({ ...form, signOnCountry: e.target.value })} className={inputCls} />
          </div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 pt-2">Planned Sign Off</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">Date</label><input type="datetime-local" value={form.signOffDate} onChange={(e) => setForm({ ...form, signOffDate: e.target.value })} className={inputCls} /></div>
            <input placeholder="Port" value={form.signOffPort} onChange={(e) => setForm({ ...form, signOffPort: e.target.value })} className={inputCls} />
            <input placeholder="Country" value={form.signOffCountry} onChange={(e) => setForm({ ...form, signOffCountry: e.target.value })} className={inputCls} />
          </div>
          <input placeholder="Remarks (optional)" value={form.remarks ?? ""} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className={inputCls} />
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Seafarer</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Company</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Sign On</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Sign Off</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-2 text-sm">{seafarerLabel(v.indosMasterId)}</td>
                  <td className="px-4 py-2 text-sm">{companyLabel(v.companyId)}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      v.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                      v.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                      v.status === "TERMINATED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>{v.status ?? "DRAFT"}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">{v.signOnPort}, {v.signOnCountry}<br /><span className="text-xs text-gray-500">{new Date(v.signOnDate).toLocaleDateString()}</span></td>
                  <td className="px-4 py-2 text-sm">{v.signOffPort}, {v.signOffCountry}<br /><span className="text-xs text-gray-500">{new Date(v.signOffDate).toLocaleDateString()}</span></td>
                  <td className="px-4 py-2"><button onClick={() => handleDelete(v.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
