import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-surface-50 dark:bg-surface-900/30 min-h-screen">
        {children}
      </main>
    </>
  );
}
