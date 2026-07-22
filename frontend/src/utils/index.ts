export function formatDateBR(date: Date): string {
	return date.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

export function getTodayISO(): string {
	return new Date().toISOString().split("T")[0];
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
