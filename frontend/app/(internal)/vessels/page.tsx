// app/(internal)/vessels/page.tsx
import { useEffect, useState } from 'react';
import { getAllVessels, deleteVessel, VesselResponseDTO } from '../../../../lib/apiClient';
import VesselForm from '../../../components/VesselForm';

export default function VesselsPage() {
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVessels = async () => {
    setLoading(true);
    try {
      const data = await getAllVessels();
      setVessels(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load vessels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vessel?')) return;
    try {
      await deleteVessel(id);
      setVessels((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vessels</h1>
      {error && <p className="text-red-600">{error}</p>}
      <VesselForm onCreated={fetchVessels} />
      {loading ? (
        <p>Loading vessels...</p>
      ) : (
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">IMO</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Flag</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vessels.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.imo}</td>
                <td className="px-4 py-2">{v.name}</td>
                <td className="px-4 py-2">{v.flag}</td>
                <td className="px-4 py-2">{v.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 space-x-2">
                  {/* Edit functionality could be added later */}
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
