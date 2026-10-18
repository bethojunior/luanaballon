import { notFound } from 'next/navigation';
import ResourceList from '@/components/admin/ResourceList';
import { RESOURCES } from '@/lib/adminConfig';

export default function ListPage({ params }: { params: { resource: string } }) {
  if (!RESOURCES[params.resource]) notFound();
  return <ResourceList resource={params.resource} />;
}
