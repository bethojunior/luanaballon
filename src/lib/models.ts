import { query } from './db';

type ColType = 'str' | 'num' | 'bool' | 'json' | 'date';
type Dir = 'ASC' | 'DESC';
export type FindOpts = {
  where?: Record<string, any>;
  like?: [string, string];
  ne?: number | string;
  order?: [string, Dir][];
  limit?: number;
};

const SYSTEM = ['id', 'createdAt', 'updatedAt'];
const esc = (s: string) => s.replace(/[\\%_]/g, '\\$&');

/** Acesso mínimo a uma tabela: lista colunas conhecidas e converte tipos na leitura/escrita. */
export class Table {
  constructor(readonly name: string, readonly cols: Record<string, ColType>) {}

  private col(k: string) {
    if (!(k in this.cols) && !SYSTEM.includes(k)) throw new Error(`Coluna inválida: ${k}`);
    return `\`${k}\``;
  }

  private hydrate(row: any) {
    if (!row) return null;
    const o: any = { _id: row.id, createdAt: row.createdAt, updatedAt: row.updatedAt };
    for (const [k, t] of Object.entries(this.cols)) {
      const v = row[k];
      o[k] = t === 'bool' ? !!v : t === 'json' ? (typeof v === 'string' ? JSON.parse(v) : v ?? []) : v;
    }
    return o;
  }

  private coerce(data: Record<string, any>) {
    const out: Record<string, any> = {};
    for (const [k, t] of Object.entries(this.cols)) {
      let v = data[k];
      if (v === undefined) continue;
      if (t === 'num') v = v === '' || v === null ? null : Number(v);
      else if (t === 'bool') v = v ? 1 : 0;
      else if (t === 'json') v = JSON.stringify(v ?? []);
      else if (t === 'date') v = v ? new Date(v) : null;
      else v = v === '' || v === null ? null : String(v);
      out[k] = v;
    }
    return out;
  }

  private clauses({ where = {}, like, ne }: FindOpts) {
    const parts: string[] = [];
    const params: any[] = [];
    for (const [k, v] of Object.entries(where)) {
      parts.push(`${this.col(k)} = ?`);
      params.push(typeof v === 'boolean' ? +v : v);
    }
    if (like) {
      parts.push(`${this.col(like[0])} LIKE ?`);
      params.push(`%${esc(like[1])}%`);
    }
    if (ne != null) {
      parts.push('`id` <> ?');
      params.push(ne);
    }
    return { sql: parts.length ? ` WHERE ${parts.join(' AND ')}` : '', params };
  }

  async find(opts: FindOpts = {}): Promise<any[]> {
    const { sql, params } = this.clauses(opts);
    const order = opts.order?.length ? ` ORDER BY ${opts.order.map(([k, d]) => `${this.col(k)} ${d === 'DESC' ? 'DESC' : 'ASC'}`).join(', ')}` : '';
    const limit = opts.limit ? ` LIMIT ${Math.floor(opts.limit)}` : '';
    const rows = await query<any[]>(`SELECT * FROM \`${this.name}\`${sql}${order}${limit}`, params);
    return rows.map((r) => this.hydrate(r));
  }

  async findOne(opts: FindOpts = {}) {
    return (await this.find({ ...opts, limit: 1 }))[0] ?? null;
  }

  async findById(id: number | string) {
    const rows = await query<any[]>(`SELECT * FROM \`${this.name}\` WHERE id = ?`, [id]);
    return this.hydrate(rows[0]);
  }

  async count(where: Record<string, any> = {}) {
    const { sql, params } = this.clauses({ where });
    const rows = await query<any[]>(`SELECT COUNT(*) AS n FROM \`${this.name}\`${sql}`, params);
    return Number(rows[0].n);
  }

  async exists(where: Record<string, any>, ne?: number | string) {
    const { sql, params } = this.clauses({ where, ne });
    const rows = await query<any[]>(`SELECT 1 FROM \`${this.name}\`${sql} LIMIT 1`, params);
    return rows.length > 0;
  }

  async create(data: Record<string, any>) {
    const res: any = await query(`INSERT INTO \`${this.name}\` SET ?`, [this.coerce(data)]);
    return this.findById(res.insertId);
  }

  async update(id: number | string, data: Record<string, any>) {
    const set = this.coerce(data);
    if (Object.keys(set).length) await query(`UPDATE \`${this.name}\` SET ? WHERE id = ?`, [set, id]);
    return this.findById(id);
  }

  async remove(id: number | string) {
    await query(`DELETE FROM \`${this.name}\` WHERE id = ?`, [id]);
  }

  /** Atualiza o registro que casa com `where`, ou cria se não existir. */
  async upsert(where: Record<string, any>, data: Record<string, any>) {
    const cur = await this.findOne({ where });
    return cur ? this.update(cur._id, data) : this.create({ ...where, ...data });
  }
}

export const Category = new Table('categories', {
  name: 'str', slug: 'str', description: 'str', image: 'str', order: 'num',
});

export const Product = new Table('products', {
  name: 'str', slug: 'str', description: 'str', price: 'num', comparePrice: 'num',
  images: 'json', category: 'num', featured: 'bool', active: 'bool',
});

export const Post = new Table('posts', {
  title: 'str', slug: 'str', excerpt: 'str', content: 'str', cover: 'str', published: 'bool', publishedAt: 'date',
});

export const Settings = new Table('settings', {
  key: 'str', layout: 'str', storeName: 'str', whatsapp: 'str', heroTitle: 'str', heroSubtitle: 'str',
  instagram: 'str', email: 'str', address: 'str', aboutText: 'str',
});

/** Substitui o id em `category` por { _id, name, slug } (equivalente ao antigo populate). */
export async function withCategory<T extends { category?: any }>(rows: T[]): Promise<T[]> {
  const ids = Array.from(new Set(rows.map((r) => r.category).filter((x) => x != null)));
  if (!ids.length) return rows;
  const cats = await query<any[]>('SELECT id, name, slug FROM categories WHERE id IN (?)', [ids]);
  const byId = new Map(cats.map((c) => [c.id, { _id: c.id, name: c.name, slug: c.slug }]));
  return rows.map((r) => ({ ...r, category: byId.get(r.category) ?? null }));
}

export const RESOURCE_MODELS: Record<string, { model: Table; titleKey: string }> = {
  products: { model: Product, titleKey: 'name' },
  categories: { model: Category, titleKey: 'name' },
  posts: { model: Post, titleKey: 'title' },
};
