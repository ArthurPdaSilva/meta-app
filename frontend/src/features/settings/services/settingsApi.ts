import type { User } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function updateNameRequest(
	token: string,
	name: string,
): Promise<User> {
	const res = await fetch(`${API_URL}/users/profile`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message ?? "Falha ao atualizar nome");
	}
	return res.json();
}
