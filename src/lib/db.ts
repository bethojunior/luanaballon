import mongoose from 'mongoose';

const g = globalThis as any;
g._mongoose ||= { conn: null, promise: null };

export async function connectDB() {
  if (g._mongoose.conn) return g._mongoose.conn;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:8517/luana';
  g._mongoose.promise ||= mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    g._mongoose.conn = await g._mongoose.promise;
  } catch (e) {
    g._mongoose.promise = null;
    throw e;
  }
  return g._mongoose.conn;
}
