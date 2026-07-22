import Database from "better-sqlite3";

export class SQLitePool {
	private db: Database.Database;

	constructor(existingDb?: Database.Database) {
		if (existingDb) {
			this.db = existingDb;
		} else {
			this.db = new Database(":memory:");
			this.db.pragma("journal_mode = WAL");
			this.db.function("now", () => new Date().toISOString());
			this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          email       TEXT UNIQUE NOT NULL,
          password    TEXT NOT NULL,
          name        TEXT NOT NULL,
          "createdAt" TEXT DEFAULT (NOW())
        );
        CREATE TABLE IF NOT EXISTS goals (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id     INTEGER NOT NULL,
          title       TEXT NOT NULL,
          description TEXT,
          "createdAt" TEXT DEFAULT (NOW()),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS checklist_items (
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
		}
	}

	async query(text: string, params?: unknown[]) {
		const upper = text.trim().toUpperCase();
		const hasReturning = text.toUpperCase().includes("RETURNING");

		if (upper.startsWith("SELECT") || hasReturning) {
			const rows = params
				? this.db.prepare(text).all(...params)
				: this.db.prepare(text).all();
			return { rows };
		}

		this.db.prepare(text).run(...(params ?? []));
		return { rows: [] as Record<string, unknown>[] };
	}
}

export const DatabaseProvider = {
	provide: "DB_POOL",
	useFactory: () => {
		return new SQLitePool();
	},
};
