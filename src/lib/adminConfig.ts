import { brl } from './utils';

export type Field = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'markdown' | 'number' | 'boolean' | 'image' | 'images' | 'category' | 'theme';
  help?: string;
  required?: boolean;
  half?: boolean;
};

export type ResourceConfig = {
  label: string;
  singular: string;
  title: (i: any) => string;
  subtitle: (i: any) => string;
  thumb: (i: any) => string | undefined;
  status?: (i: any) => string;
  fields: Field[];
  defaults?: Record<string, any>;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  products: {
    label: 'Produtos',
    singular: 'produto',
    title: (i) => i.name,
    subtitle: (i) => `${brl(i.price)} · ${i.category?.name ?? 'Sem categoria'}`,
    thumb: (i) => i.images?.[0],
    status: (i) => (i.active ? 'Ativo' : 'Inativo'),
    defaults: { active: true, featured: false, images: [] },
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'category', label: 'Categoria', type: 'category', half: true },
      { key: 'price', label: 'Preço (R$)', type: 'number', required: true, half: true },
      { key: 'comparePrice', label: 'Preço "de" (riscado, opcional)', type: 'number', half: true },
      { key: 'description', label: 'Descrição', type: 'textarea' },
      { key: 'images', label: 'Fotos', type: 'images', help: 'A primeira foto é a capa.' },
      { key: 'featured', label: 'Destaque na home', type: 'boolean', half: true },
      { key: 'active', label: 'Visível na loja', type: 'boolean', half: true },
    ],
  },
  categories: {
    label: 'Categorias',
    singular: 'categoria',
    title: (i) => i.name,
    subtitle: (i) => i.description || '',
    thumb: (i) => i.image,
    defaults: { order: 0 },
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true },
      { key: 'order', label: 'Ordem de exibição', type: 'number', half: true },
      { key: 'description', label: 'Descrição curta', type: 'textarea' },
      { key: 'image', label: 'Imagem', type: 'image' },
    ],
  },
  posts: {
    label: 'Blog',
    singular: 'post',
    title: (i) => i.title,
    subtitle: (i) => i.excerpt || '',
    thumb: (i) => i.cover,
    status: (i) => (i.published ? 'Publicado' : 'Rascunho'),
    defaults: { published: false },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'excerpt', label: 'Resumo', type: 'textarea' },
      { key: 'cover', label: 'Imagem de capa', type: 'image' },
      { key: 'content', label: 'Conteúdo (Markdown)', type: 'markdown', help: 'Use # título, **negrito**, - listas, [link](url), ![imagem](url).' },
      { key: 'published', label: 'Publicado', type: 'boolean' },
    ],
  },
};

export const SETTINGS_FIELDS: Field[] = [
  { key: 'storeName', label: 'Nome da loja', type: 'text', half: true },
  { key: 'whatsapp', label: 'WhatsApp (com DDI+DDD, só números)', type: 'text', half: true, help: 'Ex: 5511999998888. Os pedidos do carrinho chegam neste número.' },
  { key: 'heroTitle', label: 'Título da home', type: 'text' },
  { key: 'heroSubtitle', label: 'Subtítulo da home', type: 'textarea' },
  { key: 'aboutText', label: 'Texto "sobre" (rodapé)', type: 'textarea' },
  { key: 'instagram', label: 'Instagram (URL)', type: 'text', half: true },
  { key: 'email', label: 'E-mail', type: 'text', half: true },
  { key: 'address', label: 'Endereço / região de atendimento', type: 'text' },
];

export const APPEARANCE_FIELDS: Field[] = [
  { key: 'layout', label: 'Layout do site', type: 'theme', help: 'Escolha qual layout fica ativo na loja. A mudança vale assim que você salvar.' },
];
