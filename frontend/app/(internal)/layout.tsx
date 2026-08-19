// app/(internal)/layout.tsx
import Sidebar from "../../components/Sidebar";

export const metadata = {
  title: "Admin Dashboard | Maritime System",
  description: "Internal admin UI for managing backend data",
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-canvas text-ink font-sans">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
