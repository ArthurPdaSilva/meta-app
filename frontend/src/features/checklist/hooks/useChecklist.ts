import { useCallback, useEffect, useState } from "react";
import { alert } from "@/shared/Alert";
import { useAuthStore } from "@/stores/authStore";
import type { DayData, Goal } from "@/types";
import {
	addItem,
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
		try {
			const item = await addItem(token, title, goalId);
			setDayData((prev) =>
				prev ? { ...prev, items: [...prev.items, item] } : prev,
			);
		} catch {
			alert.error("Erro ao adicionar item");
		}
	}

	async function handleToggleItem(id: number) {
		if (!token) return;
		try {
			const updated = await toggleItem(token, id);
			setDayData((prev) =>
				prev
					? {
							...prev,
							items: prev.items.map((i) => (i.id === id ? updated : i)),
						}
					: prev,
			);
		} catch {
			alert.error("Erro ao atualizar item");
		}
	}

	async function handleRemoveItem(id: number) {
		if (!token) return;
		try {
			await removeItem(token, id);
			setDayData((prev) =>
				prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev,
			);
		} catch {
			alert.error("Erro ao remover item");
		}
	}

	async function handleCreateGoal(title: string) {
		if (!token) return;
		try {
			const goal = await createGoal(token, title);
			setGoals((prev) => [...prev, goal]);
			alert.success("Meta criada com sucesso");
		} catch {
			alert.error("Erro ao criar meta");
		}
	}

	async function handleDeleteGoal(id: number) {
		if (!token) return;
		try {
			await deleteGoal(token, id);
			setGoals((prev) => prev.filter((g) => g.id !== id));
			alert.success("Meta removida com sucesso");
		} catch {
			alert.error("Erro ao remover meta");
		}
	}

	async function handleAdvanceDay() {
		if (!dayData) return;
		setDayData({
			...dayData,
			items: dayData.items.map((item) => ({ ...item, completed: false })),
		});
		alert.success("Checklist de hoje concluído!");
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
