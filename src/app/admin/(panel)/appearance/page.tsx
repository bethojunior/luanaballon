import ResourceForm from '@/components/admin/ResourceForm';
import { APPEARANCE_FIELDS } from '@/lib/adminConfig';

export default function AppearancePage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Aparência</h1>
      <p className="mb-6 text-ink/60">Escolha o layout ativo da loja: muda cores, fontes, formas, cabeçalho e a capa da home.</p>
      <ResourceForm fields={APPEARANCE_FIELDS} method="PUT" saveUrl="/api/admin/settings" loadUrl="/api/admin/settings" />
    </div>
  );
}
