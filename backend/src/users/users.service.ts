import { Inject, Injectable } from "@nestjs/common";
import type { Pool } from "pg";

export interface User {
	id: number;
	email: string;
	password: string;
	name: string;
	createdAt: string;
}

@Injectable()
export class UsersService {
	constructor(@Inject("DB_POOL") private readonly pool: Pool) {}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email],
		);
		return result.rows[0] ?? null;
	}

	async findById(id: number): Promise<Omit<User, "password"> | null> {
		const result = await this.pool.query(
			'SELECT id, email, name, "createdAt" FROM users WHERE id = $1',
			[id],
		);
		return result.rows[0] ?? null;
	}

	async create(email: string, password: string, name: string): Promise<User> {
		const result = await this.pool.query(
			"INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
			[email, password, name],
		);
		return result.rows[0];
	}
}
