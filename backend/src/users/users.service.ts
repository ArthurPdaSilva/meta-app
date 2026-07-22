import { Inject, Injectable } from "@nestjs/common";
import type { SQLitePool } from "../database.provider";

export interface User {
	id: number;
	email: string;
	password: string;
	name: string;
	createdAt: string;
}

@Injectable()
export class UsersService {
	constructor(@Inject("DB_POOL") private readonly pool: SQLitePool) {}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.pool.query(
			"SELECT * FROM users WHERE email = ?",
			[email],
		);
		return (result.rows[0] as User) ?? null;
	}

	async findById(id: number): Promise<Omit<User, "password"> | null> {
		const result = await this.pool.query(
			'SELECT id, email, name, "createdAt" FROM users WHERE id = ?',
			[id],
		);
		return (result.rows[0] as Omit<User, "password">) ?? null;
	}

	async create(email: string, password: string, name: string): Promise<User> {
		const result = await this.pool.query(
			"INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING *",
			[email, password, name],
		);
		return result.rows[0] as User;
	}
}
