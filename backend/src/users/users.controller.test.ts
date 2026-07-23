/// <reference types="vitest/globals" />

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { getDb, resetDb } from "../../test/helper";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
	let app: INestApplication;
	let usersService: UsersService;
	let userId: number;
	let userToken: string;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService, { provide: "DB_POOL", useFactory: getDb }],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({
				canActivate: (context: {
					switchToHttp: () => { getRequest: () => { user: { id: number } } };
				}) => {
					const req = context.switchToHttp().getRequest();
					req.user = { id: userId };
					return true;
				},
			})
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();

		usersService = moduleRef.get(UsersService);
	});

	beforeEach(async () => {
		await resetDb();
		const user = await usersService.create(
			"test@email.com",
			"hashed",
			"Nome Original",
		);
		userId = user.id;
		userToken = "mock-token";
	});

	afterAll(async () => {
		if (app) await app.close();
	});

	it("PATCH /users/profile - atualiza nome com sucesso", async () => {
		const res = await request(app.getHttpServer())
			.patch("/users/profile")
			.set("Authorization", `Bearer ${userToken}`)
			.send({ name: "Novo Nome" })
			.expect(200);

		expect(res.body).toEqual({
			id: userId,
			email: "test@email.com",
			name: "Novo Nome",
		});

		const updated = await usersService.findById(userId);
		expect(updated?.name).toBe("Novo Nome");
	});
});
