import {
	addItem,
	advanceDay,
	fetchDayData,
	fetchGoals,
	removeItem,
	toggleItem,
} from "../../../../features/checklist/services/checklistApi";

const mockFetch = jest.fn();
// biome-ignore lint/suspicious/noExplicitAny: test mock
(globalThis as any).fetch = mockFetch;
const token = "test-token";

describe("checklistApi", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it("fetchGoals", async () => {
		const goals = [{ id: 1, title: "Exercitar" }];
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(goals),
		});

		const result = await fetchGoals(token);
		expect(result).toEqual(goals);
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/goals"),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer test-token",
				}),
			}),
		);
	});

	it("fetchDayData", async () => {
		const dayData = {
			day: "2026-07-22",
			items: [{ id: 1, title: "Task", completed: false, day: "2026-07-22" }],
		};
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(dayData),
		});

		const result = await fetchDayData(token, "2026-07-22");
		expect(result).toEqual(dayData);
	});

	it("addItem", async () => {
		const item = {
			id: 1,
			title: "Nova task",
			completed: false,
			day: "2026-07-22",
		};
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(item),
		});

		const result = await addItem(token, "Nova task");
		expect(result).toEqual(item);
	});

	it("toggleItem", async () => {
		const item = { id: 1, title: "Task", completed: true, day: "2026-07-22" };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(item),
		});

		const result = await toggleItem(token, 1);
		expect(result).toEqual(item);
	});

	it("removeItem", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true });

		await expect(removeItem(token, 1)).resolves.toBeUndefined();
	});

	it("advanceDay", async () => {
		const dayData = {
			day: "2026-07-23",
			items: [],
		};
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(dayData),
		});

		const result = await advanceDay(token);
		expect(result).toEqual(dayData);
	});
});
