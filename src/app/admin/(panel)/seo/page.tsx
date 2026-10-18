import ResourceForm from '@/components/admin/ResourceForm';
import { SEO_FIELDS } from '@/lib/adminConfig';

export default function SeoPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">SEO e compartilhamento</h1>
      <p className="mb-6 text-ink/60">
        Controle como o site aparece no Google e o cartão (título, texto e foto) que surge quando o link é enviado no WhatsApp, Instagram ou Facebook.
      </p>
      <ResourceForm fields={SEO_FIELDS} method="PUT" saveUrl="/api/admin/settings" loadUrl="/api/admin/settings" />
    </div>
  );
}
