// app/(internal)/layout.tsx
import Sidebar from "../../components/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Internal admin UI for managing backend data",
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
