import type { ChecklistItem } from "@/types";

export function useDayProgress(items: ChecklistItem[]) {
	const total = items.length;
	const completed = items.filter((i) => i.completed).length;
	const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

	return {
		total,
		completed,
		percentage,
	};
}
