import { redirect } from 'next/navigation';
import AuthPanel from '@/components/AuthPanel';
import { getUser } from '@/lib/userAuth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Entrar', robots: { index: false, follow: false } };

export default async function Entrar() {
  if (await getUser()) redirect('/conta');
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <AuthPanel />
    </div>
  );
}
