import { slugify } from './utils';
import type { Table } from './models';

const STRIP = ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'publishedAt'];

/** Remove campos de sistema e normaliza valores vindos do formulário. */
export function sanitize(body: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const [k, v] of Object.entries(body)) {
    if (STRIP.includes(k)) continue;
    data[k] = k === 'category' && !v ? null : v;
  }
  return data;
}

/** Valida os dados antes de gravar. Devolve a mensagem de erro, se houver. */
export function validate(resource: string, data: Record<string, any>, creating: boolean) {
  if (resource === 'products' && (creating || 'price' in data)) {
    const price = Number(data.price);
    if (data.price === '' || data.price == null || !Number.isFinite(price) || price < 0) return 'Informe um preço válido';
  }
  return null;
}

export async function uniqueSlug(Model: Table, base: string, excludeId?: string) {
  const root = slugify(base) || 'item';
  let slug = root;
  for (let n = 2; await Model.exists({ slug }, excludeId); n++) {
    slug = `${root}-${n}`;
  }
  return slug;
}
