import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { SQLitePool } from "../database.provider";

interface ChecklistItemRow {
	id: number;
	goal_id: number | null;
	title: string;
	completed: number;
	day: string;
}

@Injectable()
export class ChecklistService {
	constructor(@Inject("DB_POOL") private readonly pool: SQLitePool) {}

	async findByDay(userId: number, day: string) {
		const result = await this.pool.query(
			`SELECT id, goal_id, title, completed, day
       FROM checklist_items
       WHERE user_id = ? AND day = ?
       ORDER BY id ASC`,
			[userId, day],
		);

		const items = (result.rows as ChecklistItemRow[]).map((row) => ({
			id: row.id,
			goalId: row.goal_id ?? undefined,
			title: row.title,
			completed: !!row.completed,
			day: row.day,
		}));

		return { day, items };
	}

	async addItem(userId: number, day: string, title: string, goalId?: number) {
		const result = await this.pool.query(
			`INSERT INTO checklist_items (user_id, day, title, goal_id)
       VALUES (?, ?, ?, ?)
       RETURNING id, goal_id, title, completed, day`,
			[userId, day, title, goalId ?? null],
		);

		const row = result.rows[0] as ChecklistItemRow;
		return {
			id: row.id,
			goalId: row.goal_id ?? undefined,
			title: row.title,
			completed: !!row.completed,
			day: row.day,
		};
	}

	async toggleItem(id: number, userId: number) {
		const current = await this.pool.query(
			"SELECT completed FROM checklist_items WHERE id = ? AND user_id = ?",
			[id, userId],
		);

		if (!current.rows.length) {
			throw new NotFoundException("Item não encontrado");
		}

		const newCompleted = (current.rows[0] as { completed: number }).completed
			? 0
			: 1;

		const result = await this.pool.query(
			`UPDATE checklist_items SET completed = ?
       WHERE id = ? AND user_id = ?
       RETURNING id, goal_id, title, completed, day`,
			[newCompleted, id, userId],
		);

		const row = result.rows[0] as ChecklistItemRow;
		return {
			id: row.id,
			goalId: row.goal_id ?? undefined,
			title: row.title,
			completed: !!row.completed,
			day: row.day,
		};
	}

	async removeItem(id: number, userId: number): Promise<void> {
		await this.pool.query(
			"DELETE FROM checklist_items WHERE id = ? AND user_id = ?",
			[id, userId],
		);
	}

	async advanceDay(_userId: number) {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const nextDay = tomorrow.toISOString().split("T")[0];
		return { day: nextDay, items: [] };
	}
}
