import { notFound } from 'next/navigation';
import ResourceForm from '@/components/admin/ResourceForm';
import { RESOURCES } from '@/lib/adminConfig';

export default function EditPage({ params }: { params: { resource: string; id: string } }) {
  const cfg = RESOURCES[params.resource];
  if (!cfg) notFound();
  const isNew = params.id === 'new';
  const base = `/api/admin/${params.resource}`;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{isNew ? `Novo ${cfg.singular}` : `Editar ${cfg.singular}`}</h1>
      <ResourceForm
        key={params.id}
        fields={cfg.fields}
        defaults={cfg.defaults}
        method={isNew ? 'POST' : 'PUT'}
        saveUrl={isNew ? base : `${base}/${params.id}`}
        loadUrl={isNew ? undefined : `${base}/${params.id}`}
        backHref={`/admin/${params.resource}`}
      />
    </div>
  );
}
