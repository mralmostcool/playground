// components/EntityTable.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EntityTableProps<T> {
  items: T[];
  columns: { key: keyof T; label: string }[];
  editPath?: (item: T) => string; // path for edit page (if any)
  deleteAction?: (id: string) => Promise<void>;
  idKey: keyof T; // key that holds the identifier, assumed string
}

export default function EntityTable<T extends Record<string, any>>({
  items,
  columns,
  editPath,
  deleteAction,
  idKey,
}: EntityTableProps<T>) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!deleteAction) return;
    if (confirm('Delete this item?')) {
      await deleteAction(id);
      // Simple refresh – reloading the page ensures list updates
      router.refresh();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {col.label}
              </th>
            ))}
            {(editPath || deleteAction) && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const id = String(item[idKey]);
            const rowContent = (
              <tr key={id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                    {String(item[col.key] ?? '')}
                  </td>
                ))}
                {(editPath || deleteAction) && (
                  <td className="px-4 py-2 space-x-2">
                    {editPath && (
                      <Link href={editPath(item)} className="text-blue-600 dark:text-blue-400 hover:underline">
                        Edit
                      </Link>
                    )}
                    {deleteAction && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
            return editPath ? (
              <Link key={id} href={editPath(item)}>
                {rowContent}
              </Link>
            ) : (
              rowContent
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
