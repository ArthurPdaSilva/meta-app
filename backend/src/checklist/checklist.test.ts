/// <reference types="vitest/globals" />

import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import { getDb, resetDb } from "../../test/helper";
import { GoalsService } from "../goals/goals.service";
import { UsersService } from "../users/users.service";
import { ChecklistService } from "./checklist.service";

describe("ChecklistService", () => {
	let checklistService: ChecklistService;
	let goalsService: GoalsService;
	let usersService: UsersService;
	let userId: number;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [PassportModule, JwtModule.register({ secret: "test" })],
			providers: [
				ChecklistService,
				GoalsService,
				UsersService,
				{ provide: "DB_POOL", useFactory: getDb },
			],
		}).compile();

		checklistService = moduleRef.get(ChecklistService);
		goalsService = moduleRef.get(GoalsService);
		usersService = moduleRef.get(UsersService);
	});

	beforeEach(async () => {
		await resetDb();
		const user = await usersService.create("a@a.com", "hash", "Arthur");
		userId = user.id;
	});

	const today = new Date().toISOString().split("T")[0];

	describe("findByDay", () => {
		it("retorna dia vazio quando sem itens", async () => {
			const result = await checklistService.findByDay(userId, today);
			expect(result.day).toBe(today);
			expect(result.items).toEqual([]);
		});

		it("retorna itens do dia", async () => {
			await checklistService.addItem(userId, today, "Tarefa 1");
			await checklistService.addItem(userId, today, "Tarefa 2");
			const result = await checklistService.findByDay(userId, today);
			expect(result.items).toHaveLength(2);
			expect(result.items[0].title).toBe("Tarefa 1");
			expect(result.items[0].completed).toBe(false);
		});

		it("nao retorna itens de outro dia", async () => {
			await checklistService.addItem(userId, today, "Hoje");
			const result = await checklistService.findByDay(userId, "2020-01-01");
			expect(result.items).toEqual([]);
		});
	});

	describe("addItem", () => {
		it("adiciona item sem goalId", async () => {
			const item = await checklistService.addItem(userId, today, "Nova task");
			expect(item.title).toBe("Nova task");
			expect(item.completed).toBe(false);
			expect(item.day).toBe(today);
			expect(item.goalId).toBeUndefined();
		});

		it("adiciona item com goalId", async () => {
			const goal = await goalsService.create(userId, "Meta existente");
			const item = await checklistService.addItem(
				userId,
				today,
				"Task",
				goal.id,
			);
			expect(item.goalId).toBe(goal.id);
		});
	});

	describe("toggleItem", () => {
		it("alterna completed de false para true", async () => {
			const item = await checklistService.addItem(userId, today, "Task");
			const toggled = await checklistService.toggleItem(item.id, userId);
			expect(toggled.completed).toBe(true);
		});

		it("alterna completed de true para false", async () => {
			const item = await checklistService.addItem(userId, today, "Task");
			await checklistService.toggleItem(item.id, userId);
			const toggled = await checklistService.toggleItem(item.id, userId);
			expect(toggled.completed).toBe(false);
		});

		it("lanca erro se item nao existe", async () => {
			await expect(checklistService.toggleItem(999, userId)).rejects.toThrow(
				"Item não encontrado",
			);
		});
	});

	describe("removeItem", () => {
		it("remove item existente", async () => {
			const item = await checklistService.addItem(userId, today, "Temp");
			await expect(
				checklistService.removeItem(item.id, userId),
			).resolves.toBeUndefined();
			const result = await checklistService.findByDay(userId, today);
			expect(result.items).toHaveLength(0);
		});
	});

	describe("advanceDay", () => {
		it("retorna o dia seguinte com itens vazios", async () => {
			const result = await checklistService.advanceDay(userId);
			expect(result.items).toEqual([]);
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const expected = tomorrow.toISOString().split("T")[0];
			expect(result.day).toBe(expected);
		});
	});
});
