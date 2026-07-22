import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useChecklist } from "../../../../features/checklist/hooks/useChecklist";
import * as api from "../../../../features/checklist/services/checklistApi";
import { useAuthStore } from "../../../../stores/authStore";

jest.mock("../../../../features/checklist/services/checklistApi");

describe("useChecklist", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useAuthStore.setState({
			token: "test-token",
			user: { id: 1, email: "a@a.com", name: "A" },
			isAuthenticated: true,
		});
	});

	afterAll(() => {
		useAuthStore.setState({
			token: null,
			user: null,
			isAuthenticated: false,
		});
	});

	it("carrega dados no mount", async () => {
		const dayData = { day: "2026-07-22", items: [] };
		const goals = [{ id: 1, title: "Meta 1" }];
		jest.spyOn(api, "fetchDayData").mockResolvedValue(dayData);
		jest.spyOn(api, "fetchGoals").mockResolvedValue(goals);

		const { result } = renderHook(() => useChecklist());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.dayData).toEqual(dayData);
		expect(result.current.goals).toEqual(goals);
	});

	it("handleAddItem adiciona item ao dayData", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([]);
		jest.spyOn(api, "addItem").mockResolvedValue({
			id: 1,
			title: "Nova task",
			completed: false,
			day: "2026-07-22",
		});

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleAddItem("Nova task");
		});
		expect(result.current.dayData?.items).toHaveLength(1);
		expect(result.current.dayData?.items[0].title).toBe("Nova task");
	});

	it("handleToggleItem alterna completed", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [{ id: 1, title: "Task", completed: false, day: "2026-07-22" }],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([]);
		jest.spyOn(api, "toggleItem").mockResolvedValue({
			id: 1,
			title: "Task",
			completed: true,
			day: "2026-07-22",
		});

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleToggleItem(1);
		});
		expect(result.current.dayData?.items[0].completed).toBe(true);
	});

	it("handleRemoveItem remove item do dayData", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [{ id: 1, title: "Task", completed: false, day: "2026-07-22" }],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([]);
		jest.spyOn(api, "removeItem").mockResolvedValue(undefined);

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleRemoveItem(1);
		});
		expect(result.current.dayData?.items).toHaveLength(0);
	});

	it("handleCreateGoal adiciona meta a lista", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([]);
		jest.spyOn(api, "createGoal").mockResolvedValue({
			id: 1,
			title: "Nova meta",
		});

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleCreateGoal("Nova meta");
		});
		expect(result.current.goals).toHaveLength(1);
		expect(result.current.goals[0].title).toBe("Nova meta");
	});

	it("handleDeleteGoal remove meta da lista", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([{ id: 1, title: "Meta" }]);
		jest.spyOn(api, "deleteGoal").mockResolvedValue(undefined);

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleDeleteGoal(1);
		});
		expect(result.current.goals).toHaveLength(0);
	});

	it("handleAdvanceDay atualiza dayData", async () => {
		jest.spyOn(api, "fetchDayData").mockResolvedValue({
			day: "2026-07-22",
			items: [],
		});
		jest.spyOn(api, "fetchGoals").mockResolvedValue([]);
		jest.spyOn(api, "advanceDay").mockResolvedValue({
			day: "2026-07-23",
			items: [],
		});

		const { result } = renderHook(() => useChecklist());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.handleAdvanceDay();
		});
		expect(result.current.dayData?.day).toBe("2026-07-23");
	});
});
