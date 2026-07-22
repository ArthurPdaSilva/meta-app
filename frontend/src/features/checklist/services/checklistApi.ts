import type { ChecklistItem, DayData, Goal } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

function headers(token: string): Record<string, string> {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
}

export async function fetchGoals(token: string): Promise<Goal[]> {
	const res = await fetch(`${API_URL}/goals`, { headers: headers(token) });
	if (!res.ok) throw new Error("Erro ao carregar metas");
	return res.json();
}

export async function createGoal(
	token: string,
	title: string,
	description?: string,
): Promise<Goal> {
	const res = await fetch(`${API_URL}/goals`, {
		method: "POST",
		headers: headers(token),
		body: JSON.stringify({ title, description }),
	});
	if (!res.ok) throw new Error("Erro ao criar meta");
	return res.json();
}

export async function deleteGoal(token: string, id: number): Promise<void> {
	const res = await fetch(`${API_URL}/goals/${id}`, {
		method: "DELETE",
		headers: headers(token),
	});
	if (!res.ok) throw new Error("Erro ao remover meta");
}

export async function fetchDayData(
	token: string,
	day: string,
): Promise<DayData> {
	const res = await fetch(`${API_URL}/checklist?day=${day}`, {
		headers: headers(token),
	});
	if (!res.ok) throw new Error("Erro ao carregar checklist");
	return res.json();
}

export async function addItem(
	token: string,
	title: string,
	goalId?: number,
): Promise<ChecklistItem> {
	const res = await fetch(`${API_URL}/checklist`, {
		method: "POST",
		headers: headers(token),
		body: JSON.stringify({ title, goalId }),
	});
	if (!res.ok) throw new Error("Erro ao adicionar item");
	return res.json();
}

export async function toggleItem(
	token: string,
	id: number,
): Promise<ChecklistItem> {
	const res = await fetch(`${API_URL}/checklist/${id}`, {
		method: "PATCH",
		headers: headers(token),
	});
	if (!res.ok) throw new Error("Erro ao atualizar item");
	return res.json();
}

export async function removeItem(token: string, id: number): Promise<void> {
	const res = await fetch(`${API_URL}/checklist/${id}`, {
		method: "DELETE",
		headers: headers(token),
	});
	if (!res.ok) throw new Error("Erro ao remover item");
}

export async function advanceDay(token: string): Promise<DayData> {
	const res = await fetch(`${API_URL}/checklist/advance-day`, {
		method: "POST",
		headers: headers(token),
	});
	if (!res.ok) throw new Error("Erro ao avançar dia");
	return res.json();
}
