import { Pool, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function hasNeonDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getNeonPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  return pool;
}

export async function neonQuery<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  const db = getNeonPool();
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }

  return db.query<T>(text, values);
}
