/// <reference types="vitest/globals" />

import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import { getDb, resetDb } from "../../test/helper";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let authService: AuthService;
	let _usersService: UsersService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				PassportModule,
				JwtModule.register({
					secret: "test-secret",
					signOptions: { expiresIn: "7d" },
				}),
			],
			providers: [
				AuthService,
				UsersService,
				{ provide: "DB_POOL", useFactory: getDb },
			],
		}).compile();

		authService = moduleRef.get(AuthService);
		_usersService = moduleRef.get(UsersService);
	});

	beforeEach(async () => {
		await resetDb();
	});

	describe("register", () => {
		it("registra um novo usuário", async () => {
			const result = await authService.register("a@a.com", "123456", "Arthur");
			expect(result.token).toBeDefined();
			expect(result.user.email).toBe("a@a.com");
			expect(result.user.name).toBe("Arthur");
		});

		it("rejeita email duplicado", async () => {
			await authService.register("a@a.com", "123456", "Arthur");
			await expect(
				authService.register("a@a.com", "123456", "Arthur"),
			).rejects.toThrow("Email já cadastrado");
		});
	});

	describe("login", () => {
		beforeEach(async () => {
			await authService.register("a@a.com", "123456", "Arthur");
		});

		it("loga com credenciais válidas", async () => {
			const result = await authService.login("a@a.com", "123456");
			expect(result.token).toBeDefined();
			expect(result.user.email).toBe("a@a.com");
		});

		it("rejeita senha inválida", async () => {
			await expect(authService.login("a@a.com", "wrong")).rejects.toThrow(
				"Email ou senha inválidos",
			);
		});

		it("rejeita email inexistente", async () => {
			await expect(authService.login("x@x.com", "123456")).rejects.toThrow(
				"Email ou senha inválidos",
			);
		});
	});
});
