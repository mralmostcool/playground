"use client";
import { useEffect, useState } from "react";
import { getAllEnrollments, createEnrollment, deleteEnrollment, getAllCourses, getAllIndos, EnrollmentRequestDTO, EnrollmentResponseDTO, PreSeaCoursesResponseDTO, IndosMasterResponseDTO } from "@/lib/apiClient";

export default function EnrollmentsPage() {
  const [items, setItems] = useState<EnrollmentResponseDTO[]>([]);
  const [courses, setCourses] = useState<PreSeaCoursesResponseDTO[]>([]);
  const [seafarers, setSeafarers] = useState<IndosMasterResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EnrollmentRequestDTO>({ preSeaCourseId: "", indosMasterId: "", status: "ENROLLED", remarks: "" });

  const fetchData = async () => { setLoading(true); try { const [e, c, s] = await Promise.all([getAllEnrollments(), getAllCourses(), getAllIndos()]); setItems(e); setCourses(c); setSeafarers(s); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try { await createEnrollment(form); setForm({ preSeaCourseId: "", indosMasterId: "", status: "ENROLLED", remarks: "" }); setShowForm(false); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enrollment?")) return;
    try { await deleteEnrollment(id); setItems((p) => p.filter((v) => v.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const courseName = (id: string) => courses.find((c) => c.id === id)?.name ?? id;
  const seafarerName = (id: string) => { const s = seafarers.find((s) => s.id === id); return s ? `${s.firstName} (${s.indos})` : id; };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{showForm ? "Cancel" : "+ Add Enrollment"}</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {showForm && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <select value={form.preSeaCourseId} onChange={(e) => setForm({ ...form, preSeaCourseId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.indosMasterId} onChange={(e) => setForm({ ...form, indosMasterId: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="">Select Seafarer</option>
            {seafarers.map((s) => <option key={s.id} value={s.id}>{s.firstName} ({s.indos})</option>)}
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="ENROLLED">Enrolled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input placeholder="Remarks (optional)" value={form.remarks ?? ""} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Course</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Seafarer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Remarks</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-2 text-sm">{courseName(v.preSeaCourseId)}</td>
                <td className="px-4 py-2 text-sm">{seafarerName(v.indosMasterId)}</td>
                <td className="px-4 py-2 text-sm"><span className={`px-2 py-0.5 rounded text-xs font-medium ${v.status === "COMPLETED" ? "bg-green-100 text-green-800" : v.status === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>{v.status}</span></td>
                <td className="px-4 py-2 text-sm">{v.remarks ?? "—"}</td>
                <td className="px-4 py-2"><button onClick={() => handleDelete(v.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
