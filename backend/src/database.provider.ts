import { Pool } from "pg";

export const DatabaseProvider = {
	provide: "DB_POOL",
	useFactory: () => {
		return new Pool({
			connectionString:
				process.env.DATABASE_URL ?? "postgres://localhost:5432/metaapp",
		});
	},
};
