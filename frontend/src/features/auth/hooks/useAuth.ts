import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { alert } from "@/shared/Alert";
import { useAuthStore } from "@/stores/authStore";
import { loginSchema, registerSchema } from "../schemas/authSchemas";
import { loginRequest, registerRequest } from "../services/authApi";

export interface FormData {
	email: string;
	password: string;
	name: string;
	confirmPassword: string;
}

export function useAuth() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const setAuth = useAuthStore((s) => s.setAuth);
	const router = useRouter();
	const isLogin = mode === "login";

	const resolver = useMemo<Resolver<FormData>>(
		() =>
			(isLogin
				? zodResolver(loginSchema)
				: zodResolver(registerSchema)) as Resolver<FormData>,
		[isLogin],
	);

	const { control, handleSubmit, reset } = useForm<FormData>({
		resolver,
		defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
	});

	const onSubmit = useCallback(
		async (data: FormData) => {
			setError(null);
			setLoading(true);
			try {
				const result = isLogin
					? await loginRequest(data.email, data.password)
					: await registerRequest(data.email, data.password, data.name);
				setAuth(result.token, result.user);
				alert.success(
					isLogin ? "Login realizado com sucesso" : "Conta criada com sucesso",
				);
				router.replace("/");
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erro inesperado";
				setError(message);
				alert.error(message);
			} finally {
				setLoading(false);
			}
		},
		[isLogin, setAuth, router],
	);

	function toggleMode() {
		setMode((m) => (m === "login" ? "register" : "login"));
		setError(null);
		reset();
	}

	return {
		mode,
		error,
		loading,
		control,
		onSubmit: handleSubmit(onSubmit),
		toggleMode,
	};
}
