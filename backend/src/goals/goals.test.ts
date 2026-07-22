/// <reference types="vitest/globals" />

import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import { getDb, resetDb } from "../../test/helper";
import { UsersService } from "../users/users.service";
import { GoalsService } from "./goals.service";

describe("GoalsService", () => {
	let goalsService: GoalsService;
	let usersService: UsersService;
	let userId: number;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [PassportModule, JwtModule.register({ secret: "test" })],
			providers: [
				GoalsService,
				UsersService,
				{ provide: "DB_POOL", useFactory: getDb },
			],
		}).compile();

		goalsService = moduleRef.get(GoalsService);
		usersService = moduleRef.get(UsersService);
	});

	beforeEach(async () => {
		await resetDb();
		const user = await usersService.create("a@a.com", "hash", "Arthur");
		userId = user.id;
	});

	describe("findAllByUser", () => {
		it("retorna lista vazia quando nao ha metas", async () => {
			const goals = await goalsService.findAllByUser(userId);
			expect(goals).toEqual([]);
		});

		it("retorna metas do usuario", async () => {
			await goalsService.create(userId, "Exercitar");
			await goalsService.create(userId, "Ler", "Ler 30 min");
			const goals = await goalsService.findAllByUser(userId);
			expect(goals).toHaveLength(2);
			expect(goals[0].title).toBe("Ler");
		});

		it("nao retorna metas de outro usuario", async () => {
			const other = await usersService.create("b@b.com", "hash", "Bia");
			await goalsService.create(userId, "Meu objetivo");
			const otherGoals = await goalsService.findAllByUser(other.id);
			expect(otherGoals).toEqual([]);
		});
	});

	describe("create", () => {
		it("cria meta com titulo", async () => {
			const goal = await goalsService.create(userId, "Estudar");
			expect(goal.title).toBe("Estudar");
			expect(goal.description).toBeNull();
		});

		it("cria meta com descricao", async () => {
			const goal = await goalsService.create(
				userId,
				"Estudar",
				"Estudar nestjs",
			);
			expect(goal.title).toBe("Estudar");
			expect(goal.description).toBe("Estudar nestjs");
		});
	});

	describe("delete", () => {
		it("remove meta existente", async () => {
			const goal = await goalsService.create(userId, "Temporario");
			await expect(
				goalsService.delete(goal.id, userId),
			).resolves.toBeUndefined();
			const goals = await goalsService.findAllByUser(userId);
			expect(goals).toHaveLength(0);
		});

		it("nao remove meta de outro usuario", async () => {
			const goal = await goalsService.create(userId, "Meu");
			const other = await usersService.create("c@c.com", "hash", "Carol");
			await expect(
				goalsService.delete(goal.id, other.id),
			).resolves.toBeUndefined();
			const goals = await goalsService.findAllByUser(userId);
			expect(goals).toHaveLength(1);
		});
	});
});
