import { newDb, DataType } from "pg-mem";
import { Pool } from "pg";

const pgMem = newDb();

pgMem.public.registerFunction({
  name: "now",
  returns: DataType.timestamptz,
  implementation: () => new Date().toISOString(),
});

pgMem.public.none(`
  CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    name        TEXT NOT NULL,
    "createdAt" TEXT DEFAULT NOW()
  );
`);

const backup = pgMem.backup();

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = new (pgMem.adapters.createPg().Pool)();
  }
  return pool as Pool;
}

export async function resetDb(): Promise<void> {
  backup.restore();
}
