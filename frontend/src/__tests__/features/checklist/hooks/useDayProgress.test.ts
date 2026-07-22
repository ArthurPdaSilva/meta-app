import { renderHook } from "@testing-library/react-native";
import { useDayProgress } from "../../../../features/checklist/hooks/useDayProgress";

describe("useDayProgress", () => {
	it("retorna 0 quando nao ha itens", async () => {
		const { result } = await renderHook(() => useDayProgress([]));
		expect(result.current.total).toBe(0);
		expect(result.current.completed).toBe(0);
		expect(result.current.percentage).toBe(0);
	});

	it("calcula porcentagem corretamente", async () => {
		const items = [
			{ id: 1, title: "A", completed: true, day: "2026-07-22" },
			{ id: 2, title: "B", completed: false, day: "2026-07-22" },
			{ id: 3, title: "C", completed: true, day: "2026-07-22" },
			{ id: 4, title: "D", completed: false, day: "2026-07-22" },
		];
		const { result } = await renderHook(() => useDayProgress(items));
		expect(result.current.total).toBe(4);
		expect(result.current.completed).toBe(2);
		expect(result.current.percentage).toBe(50);
	});

	it("retorna 100% quando todos concluidos", async () => {
		const items = [
			{ id: 1, title: "A", completed: true, day: "2026-07-22" },
			{ id: 2, title: "B", completed: true, day: "2026-07-22" },
		];
		const { result } = await renderHook(() => useDayProgress(items));
		expect(result.current.percentage).toBe(100);
	});
});
