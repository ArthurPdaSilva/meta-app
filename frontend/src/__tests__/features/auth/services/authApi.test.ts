import {
	loginRequest,
	registerRequest,
} from "../../../../features/auth/services/authApi";

const mockFetch = jest.fn();
// biome-ignore lint/suspicious/noExplicitAny: test mock
(globalThis as any).fetch = mockFetch;

describe("authApi", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	describe("loginRequest", () => {
		it("retorna AuthResponse em caso de sucesso", async () => {
			const authResponse = {
				token: "abc",
				user: { id: 1, email: "a@a.com", name: "Arthur" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(authResponse),
			});

			const result = await loginRequest("a@a.com", "123456");
			expect(result).toEqual(authResponse);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/auth/login"),
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({ email: "a@a.com", password: "123456" }),
				}),
			);
		});

		it("lanca erro quando falha", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: jest
					.fn()
					.mockResolvedValueOnce({ message: "Credenciais invalidas" }),
			});

			await expect(loginRequest("a@a.com", "wrong")).rejects.toThrow(
				"Credenciais invalidas",
			);
		});
	});

	describe("registerRequest", () => {
		it("retorna AuthResponse em caso de sucesso", async () => {
			const authResponse = {
				token: "abc",
				user: { id: 1, email: "a@a.com", name: "Arthur" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(authResponse),
			});

			const result = await registerRequest("a@a.com", "123456", "Arthur");
			expect(result).toEqual(authResponse);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/auth/register"),
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({
						email: "a@a.com",
						password: "123456",
						name: "Arthur",
					}),
				}),
			);
		});
	});
});
