// components/GenericForm.tsx
import { useState, FormEvent } from 'react';

type FieldDefinition = {
  name: string;
  label: string;
  type?: string; // default "text"
  placeholder?: string;
  required?: boolean;
};

interface GenericFormProps<T> {
  fields: FieldDefinition[];
  initialData?: Partial<T>;
  submitLabel?: string;
  onSubmit: (data: T) => Promise<void> | void;
}

export default function GenericForm<T extends Record<string, any>>({
  fields,
  initialData = {},
  submitLabel = 'Submit',
  onSubmit,
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Type assertion safe because fields define the keys
      await onSubmit(formData as T);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
      {error && <p className="text-red-600">{error}</p>}
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor={field.name}>
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            required={field.required}
            value={(formData as any)[field.name] ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {submitLabel}
      </button>
    </form>
  );
}
