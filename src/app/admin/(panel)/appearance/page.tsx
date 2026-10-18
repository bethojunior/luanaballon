import ResourceForm from '@/components/admin/ResourceForm';
import { APPEARANCE_FIELDS } from '@/lib/adminConfig';

export default function AppearancePage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Aparência</h1>
      <p className="mb-6 text-ink/60">Escolha o layout ativo da loja: muda cores, fontes, formas, cabeçalho e a capa da home.</p>
      <p className="mb-6 text-sm text-ink/60">
        Para testar ou divulgar outro layout sem alterar o ativo, adicione a flag na URL do site: <code className="rounded bg-ink/10 px-1">/?l=2</code>, <code className="rounded bg-ink/10 px-1">/?l=3</code>… (o número aparece em cada layout abaixo). Também vale o nome: <code className="rounded bg-ink/10 px-1">/?l=natal</code> (modelo 1) ou <code className="rounded bg-ink/10 px-1">/?l=natal-2</code> (modelo 2). A escolha fica gravada no navegador; use <code className="rounded bg-ink/10 px-1">/?l=0</code> para voltar ao layout ativo.
      </p>
      <ResourceForm fields={APPEARANCE_FIELDS} method="PUT" saveUrl="/api/admin/settings" loadUrl="/api/admin/settings" />
    </div>
  );
}
