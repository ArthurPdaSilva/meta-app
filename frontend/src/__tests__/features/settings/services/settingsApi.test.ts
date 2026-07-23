import { updateNameRequest } from "../../../../features/settings/services/settingsApi";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("settingsApi", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("updateNameRequest envia PATCH com token e nome", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					id: 1,
					email: "a@a.com",
					name: "Novo Nome",
				}),
		});

		const result = await updateNameRequest("token123", "Novo Nome");
		expect(result.name).toBe("Novo Nome");
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/users/profile"),
			expect.objectContaining({
				method: "PATCH",
				headers: expect.objectContaining({
					Authorization: "Bearer token123",
				}),
				body: JSON.stringify({ name: "Novo Nome" }),
			}),
		);
	});

	it("updateNameRequest lanca erro quando falha", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ message: "Erro no servidor" }),
		});

		await expect(updateNameRequest("token123", "Nome")).rejects.toThrow(
			"Erro no servidor",
		);
	});
});
