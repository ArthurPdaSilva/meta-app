import Database from "better-sqlite3";
import { SQLitePool } from "../src/database.provider";

const db = new Database(":memory:");
db.pragma("journal_mode = WAL");
db.function("now", () => new Date().toISOString());
db.exec(`
  CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    name        TEXT NOT NULL,
    "createdAt" TEXT DEFAULT (NOW())
  );
  CREATE TABLE goals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    "createdAt" TEXT DEFAULT (NOW()),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE checklist_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    day         TEXT NOT NULL,
    title       TEXT NOT NULL,
    goal_id     INTEGER,
    completed   INTEGER DEFAULT 0,
    "createdAt" TEXT DEFAULT (NOW()),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
  );
`);

let pool: SQLitePool | null = null;

export function getDb(): SQLitePool {
	if (!pool) {
		pool = new SQLitePool(db);
	}
	return pool;
}

export async function resetDb(): Promise<void> {
	db.exec("DELETE FROM checklist_items");
	db.exec("DELETE FROM goals");
	db.exec("DELETE FROM users");
}
