/// <reference types="vitest/globals" />

import { Test } from "@nestjs/testing";
import { getDb, resetDb } from "../../test/helper";
import type { User } from "./users.service";
import { UsersService } from "./users.service";

describe("UsersService", () => {
	let service: UsersService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [UsersService, { provide: "DB_POOL", useFactory: getDb }],
		}).compile();
		service = module.get(UsersService);
	});

	beforeEach(async () => {
		await resetDb();
	});

	it("cria e encontra usuário por email", async () => {
		const user = await service.create("a@a.com", "hash", "Arthur");
		expect(user.email).toBe("a@a.com");
		expect(user.name).toBe("Arthur");

		const found = await service.findByEmail("a@a.com");
		expect(found).not.toBeNull();
		expect(found?.name).toBe("Arthur");
	});

	it("retorna null se email não existe", async () => {
		const found = await service.findByEmail("x@x.com");
		expect(found).toBeNull();
	});

	it("findById retorna sem password", async () => {
		const user = await service.create("b@b.com", "hash", "Bia");
		const found = await service.findById(user.id);
		expect(found).not.toBeNull();
		expect(found?.email).toBe("b@b.com");
		expect((found as User).password).toBeUndefined();
	});
});
