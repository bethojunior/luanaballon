import mongoose, { Schema } from 'mongoose';

type M = mongoose.Model<any>;
const opts = { timestamps: true };

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    order: { type: Number, default: 0 },
  },
  opts,
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    comparePrice: Number,
    images: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  opts,
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    cover: String,
    published: { type: Boolean, default: false },
    publishedAt: Date,
  },
  opts,
);

const SettingsSchema = new Schema({
  key: { type: String, default: 'main', unique: true },
  layout: { type: String, enum: ['festa', 'elegante', 'minimo'], default: 'festa' },
  storeName: String,
  whatsapp: String,
  heroTitle: String,
  heroSubtitle: String,
  instagram: String,
  email: String,
  address: String,
  aboutText: String,
});

export const Category: M = (mongoose.models.Category as M) || mongoose.model('Category', CategorySchema);
export const Product: M = (mongoose.models.Product as M) || mongoose.model('Product', ProductSchema);
export const Post: M = (mongoose.models.Post as M) || mongoose.model('Post', PostSchema);
export const Settings: M = (mongoose.models.Settings as M) || mongoose.model('Settings', SettingsSchema);

export const RESOURCE_MODELS: Record<string, { model: M; titleKey: string }> = {
  products: { model: Product, titleKey: 'name' },
  categories: { model: Category, titleKey: 'name' },
  posts: { model: Post, titleKey: 'title' },
};
