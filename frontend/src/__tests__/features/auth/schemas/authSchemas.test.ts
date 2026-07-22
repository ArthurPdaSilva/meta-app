import {
	loginSchema,
	registerSchema,
} from "../../../../features/auth/schemas/authSchemas";

describe("authSchemas", () => {
	describe("loginSchema", () => {
		it("aceita dados validos", () => {
			const result = loginSchema.safeParse({
				email: "a@a.com",
				password: "123456",
			});
			expect(result.success).toBe(true);
		});

		it("rejeita email invalido", () => {
			const result = loginSchema.safeParse({
				email: "invalido",
				password: "123456",
			});
			expect(result.success).toBe(false);
		});

		it("rejeita senha curta", () => {
			const result = loginSchema.safeParse({
				email: "a@a.com",
				password: "123",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("registerSchema", () => {
		it("aceita dados validos", () => {
			const result = registerSchema.safeParse({
				name: "Arthur",
				email: "a@a.com",
				password: "123456",
				confirmPassword: "123456",
			});
			expect(result.success).toBe(true);
		});

		it("rejeita senhas diferentes", () => {
			const result = registerSchema.safeParse({
				name: "Arthur",
				email: "a@a.com",
				password: "123456",
				confirmPassword: "654321",
			});
			expect(result.success).toBe(false);
		});
	});
});
