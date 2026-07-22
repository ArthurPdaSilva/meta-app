import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { loginRequest, registerRequest } from "../services/authApi";

export function useAuth() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const setAuth = useAuthStore((s) => s.setAuth);
	const router = useRouter();

	async function handleSubmit(data: {
		email: string;
		password: string;
		name?: string;
	}) {
		setError(null);
		setLoading(true);
		try {
			const name = data.name ?? "";
			const result =
				mode === "login"
					? await loginRequest(data.email, data.password)
					: await registerRequest(data.email, data.password, name);
			setAuth(result.token, result.user);
			router.replace("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro inesperado");
		} finally {
			setLoading(false);
		}
	}

	function toggleMode() {
		setMode((m) => (m === "login" ? "register" : "login"));
		setError(null);
	}

	return {
		mode,
		error,
		loading,
		handleSubmit,
		toggleMode,
	};
}
