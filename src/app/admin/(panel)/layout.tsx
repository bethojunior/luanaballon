import Sidebar from '@/components/admin/Sidebar';

export const metadata = { title: 'Painel', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f1ff]">
      <Sidebar />
      <div className="mx-auto max-w-4xl p-4 md:ml-60 md:max-w-none md:p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
