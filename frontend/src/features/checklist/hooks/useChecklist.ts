import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { DayData, Goal } from "@/types";
import {
	addItem,
	advanceDay,
	createGoal,
	deleteGoal,
	fetchDayData,
	fetchGoals,
	removeItem,
	toggleItem,
} from "../services/checklistApi";

function getToday(): string {
	return new Date().toISOString().split("T")[0];
}

export function useChecklist() {
	const token = useAuthStore((s) => s.token) ?? "";
	const [dayData, setDayData] = useState<DayData | null>(null);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		try {
			const [day, goalsData] = await Promise.all([
				fetchDayData(token, getToday()),
				fetchGoals(token),
			]);
			setDayData(day);
			setGoals(goalsData);
		} catch {
			// silently fail — backend may not be available
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		load();
	}, [load]);

	async function handleAddItem(title: string, goalId?: number) {
		if (!token) return;
		const item = await addItem(token, title, goalId);
		setDayData((prev) =>
			prev ? { ...prev, items: [...prev.items, item] } : prev,
		);
	}

	async function handleToggleItem(id: number) {
		if (!token) return;
		const updated = await toggleItem(token, id);
		setDayData((prev) =>
			prev
				? {
						...prev,
						items: prev.items.map((i) => (i.id === id ? updated : i)),
					}
				: prev,
		);
	}

	async function handleRemoveItem(id: number) {
		if (!token) return;
		await removeItem(token, id);
		setDayData((prev) =>
			prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev,
		);
	}

	async function handleCreateGoal(title: string) {
		if (!token) return;
		const goal = await createGoal(token, title);
		setGoals((prev) => [...prev, goal]);
	}

	async function handleDeleteGoal(id: number) {
		if (!token) return;
		await deleteGoal(token, id);
		setGoals((prev) => prev.filter((g) => g.id !== id));
	}

	async function handleAdvanceDay() {
		if (!token) return;
		const day = await advanceDay(token);
		setDayData(day);
	}

	return {
		dayData,
		goals,
		loading,
		handleAddItem,
		handleToggleItem,
		handleRemoveItem,
		handleCreateGoal,
		handleDeleteGoal,
		handleAdvanceDay,
		refresh: load,
	};
}
