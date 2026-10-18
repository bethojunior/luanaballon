import ResourceForm from '@/components/admin/ResourceForm';
import { SETTINGS_FIELDS } from '@/lib/adminConfig';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Configurações da loja</h1>
      <ResourceForm fields={SETTINGS_FIELDS} method="PUT" saveUrl="/api/admin/settings" loadUrl="/api/admin/settings" />
    </div>
  );
}
