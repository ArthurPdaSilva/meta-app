import type { AuthResponse } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function loginRequest(
	email: string,
	password: string,
): Promise<AuthResponse> {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message ?? "Falha ao fazer login");
	}
	return res.json();
}

export async function registerRequest(
	email: string,
	password: string,
	name: string,
): Promise<AuthResponse> {
	const res = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, name }),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message ?? "Falha ao registrar");
	}
	return res.json();
}
