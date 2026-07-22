import { Inject, Injectable } from "@nestjs/common";
import type { SQLitePool } from "../database.provider";

export interface GoalRow {
	id: number;
	user_id: number;
	title: string;
	description: string | null;
	createdAt: string;
}

@Injectable()
export class GoalsService {
	constructor(@Inject("DB_POOL") private readonly pool: SQLitePool) {}

	async findAllByUser(userId: number) {
		const result = await this.pool.query(
			"SELECT id, title, description FROM goals WHERE user_id = ? ORDER BY id DESC",
			[userId],
		);
		return result.rows as {
			id: number;
			title: string;
			description: string | null;
		}[];
	}

	async create(userId: number, title: string, description?: string) {
		const result = await this.pool.query(
			"INSERT INTO goals (user_id, title, description) VALUES (?, ?, ?) RETURNING id, title, description",
			[userId, title, description ?? null],
		);
		return result.rows[0] as {
			id: number;
			title: string;
			description: string | null;
		};
	}

	async delete(id: number, userId: number): Promise<void> {
		await this.pool.query("DELETE FROM goals WHERE id = ? AND user_id = ?", [
			id,
			userId,
		]);
	}
}
