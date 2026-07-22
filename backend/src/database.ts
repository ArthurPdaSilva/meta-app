import { Pool } from "pg";

export function createDatabase(url?: string) {
	return new Pool({
		connectionString:
			url ?? process.env.DATABASE_URL ?? "postgres://localhost:5432/metaapp",
	});
}
