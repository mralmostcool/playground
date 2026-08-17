// app/(internal)/layout.tsx
import '../../globals.css';
import Sidebar from '../../components/Sidebar';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Internal admin UI for managing backend data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
