// components/VesselForm.tsx
import { useState } from 'react';
import { createVessel, VesselRequestDTO } from '../../lib/apiClient';

export default function VesselForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<VesselRequestDTO>({ imo: '', name: '', flag: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createVessel(form);
      setForm({ imo: '', name: '', flag: '', isActive: true });
      onCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create vessel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold">Add New Vessel</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium">IMO</label>
        <input
          name="imo"
          value={form.imo}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Flag</label>
        <input
          name="flag"
          value={form.flag}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-1"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm">Active</label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Vessel'}
      </button>
    </form>
  );
}
