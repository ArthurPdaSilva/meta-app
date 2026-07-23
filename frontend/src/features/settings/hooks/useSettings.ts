import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { alert } from "@/shared/Alert";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { updateNameRequest } from "../services/settingsApi";

const settingsSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export function useSettings() {
	const [loading, setLoading] = useState(false);
	const user = useAuthStore((s) => s.user);
	const token = useAuthStore((s) => s.token);
	const logout = useAuthStore((s) => s.logout);
	const isDarkMode = useThemeStore((s) => s.isDarkMode);
	const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);
	const setAuth = useAuthStore((s) => s.setAuth);
	const router = useRouter();

	const { control, handleSubmit } = useForm<SettingsFormData>({
		resolver: zodResolver(settingsSchema),
		defaultValues: { name: user?.name ?? "" },
	});

	const onSubmit = useCallback(
		async (data: SettingsFormData) => {
			if (!token) return;
			setLoading(true);
			try {
				const updatedUser = await updateNameRequest(token, data.name);
				setAuth(token, updatedUser);
				alert.success("Nome atualizado com sucesso");
			} catch (err) {
				const message = err instanceof Error ? err.message : "Erro inesperado";
				alert.error(message);
			} finally {
				setLoading(false);
			}
		},
		[token, setAuth],
	);

	function handleLogout() {
		logout();
		alert.info("Você saiu da sua conta");
		router.replace("/");
	}

	function handleBack() {
		router.back();
	}

	return {
		userName: user?.name ?? "",
		email: user?.email ?? "",
		loading,
		isDarkMode,
		control,
		onSubmit: handleSubmit(onSubmit),
		handleLogout,
		handleBack,
		toggleDarkMode,
	};
}
