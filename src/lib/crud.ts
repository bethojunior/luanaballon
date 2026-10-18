import { slugify } from './utils';

const STRIP = ['_id', '__v', 'createdAt', 'updatedAt'];

/** Remove campos de sistema e normaliza valores vindos do formulário. */
export function sanitize(body: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const [k, v] of Object.entries(body)) {
    if (STRIP.includes(k)) continue;
    data[k] = k === 'category' && !v ? null : v;
  }
  return data;
}

export async function uniqueSlug(Model: any, base: string, excludeId?: string) {
  const root = slugify(base) || 'item';
  let slug = root;
  for (let n = 2; await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); n++) {
    slug = `${root}-${n}`;
  }
  return slug;
}
