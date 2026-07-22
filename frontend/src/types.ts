export interface User {
	id: number;
	email: string;
	name: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface Goal {
	id: number;
	title: string;
	description?: string;
}

export interface ChecklistItem {
	id: number;
	goalId?: number;
	title: string;
	completed: boolean;
	day: string;
}

export interface DayData {
	day: string;
	items: ChecklistItem[];
}
