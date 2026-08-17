"use client";
import { useEffect, useState } from "react";
import { getAllAuditLogs, AuditLogsResponseDTO } from "@/lib/apiClient";

export default function AuditLogsPage() {
  const [items, setItems] = useState<AuditLogsResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ table: "", operation: "" });

  const fetchData = async () => { setLoading(true); try { setItems(await getAllAuditLogs()); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const filtered = items.filter((i) => {
    if (filter.table && !i.tableName.toLowerCase().includes(filter.table.toLowerCase())) return false;
    if (filter.operation && i.operation !== filter.operation) return false;
    return true;
  });

  const tables = [...new Set(items.map((i) => i.tableName))].sort();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-3">
        <select value={filter.table} onChange={(e) => setFilter({ ...filter, table: e.target.value })} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <option value="">All Tables</option>
          {tables.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filter.operation} onChange={(e) => setFilter({ ...filter, operation: e.target.value })} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <option value="">All Operations</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
        <span className="self-center text-sm text-gray-500">{filtered.length} entries</span>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 rounded">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Table</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Operation</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Record ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Changed At</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Old Values</th>
                <th className="px-4 py-2 text-left text-sm font-medium">New Values</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-2 text-sm font-mono">{v.tableName}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      v.operation === "INSERT" ? "bg-green-100 text-green-800" :
                      v.operation === "DELETE" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>{v.operation}</span>
                  </td>
                  <td className="px-4 py-2 text-sm font-mono text-xs">{v.recordId}</td>
                  <td className="px-4 py-2 text-sm">{new Date(v.changedAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs max-w-xs truncate" title={v.oldValues ?? ""}>{v.oldValues ? JSON.stringify(JSON.parse(v.oldValues), null, 0).slice(0, 80) : "—"}</td>
                  <td className="px-4 py-2 text-xs max-w-xs truncate" title={v.newValues ?? ""}>{v.newValues ? JSON.stringify(JSON.parse(v.newValues), null, 0).slice(0, 80) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
