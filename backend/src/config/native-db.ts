import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL ?? (() => {
  throw new Error('DATABASE_URL must be configured');
})();

let client: MongoClient | null = null;

function getDbName(uri: string): string {
  const parts = uri.split('/');
  const last = parts[parts.length - 1].split('?')[0];
  return last || 'pos_db';
}

export async function getDb() {
  if (!client) {
    const isSrv = MONGO_URI.startsWith('mongodb+srv://');
    client = new MongoClient(MONGO_URI, isSrv ? {} : { directConnection: true });
    await client.connect();
  }
  return client.db(getDbName(MONGO_URI));
}

export { ObjectId };
