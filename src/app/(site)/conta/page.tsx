import { redirect } from 'next/navigation';
import AccountView from '@/components/AccountView';
import { getUser } from '@/lib/userAuth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Minha conta', robots: { index: false, follow: false } };

export default async function Conta() {
  if (!(await getUser())) redirect('/entrar');
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <AccountView />
    </div>
  );
}
