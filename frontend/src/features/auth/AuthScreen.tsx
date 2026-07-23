import { useMemo } from "react";
import type { Control, FieldValues } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { ControlledFormInput } from "@/shared/ControlledFormInput";
import { CustomButton } from "@/shared/CustomButton";
import { useColors } from "@/styles/theme";
import { fontSize, spacing } from "@/styles/tokens";
import type { FormData } from "./hooks/useAuth";

export interface AuthScreenProps {
	mode: "login" | "register";
	error: string | null;
	loading: boolean;
	control: Control<FormData, FieldValues>;
	onSubmit: () => void;
	onToggleMode: () => void;
}

export function AuthScreen({
	mode,
	error,
	loading,
	control,
	onSubmit,
	onToggleMode,
}: AuthScreenProps) {
	const colors = useColors();
	const isLogin = mode === "login";

	const styles = useMemo(
		() =>
			StyleSheet.create({
				container: {
					flex: 1,
					backgroundColor: colors.background,
				},
				scrollContent: {
					flexGrow: 1,
					justifyContent: "center",
					padding: spacing.lg,
				},
				header: {
					alignItems: "center",
					marginBottom: spacing.xl,
				},
				title: {
					fontSize: fontSize.title,
					fontWeight: "800",
					color: colors.primary,
				},
				subtitle: {
					fontSize: fontSize.md,
					color: colors.textSecondary,
					marginTop: spacing.sm,
				},
				form: {
					backgroundColor: colors.surface,
					borderRadius: 16,
					padding: spacing.lg,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.05,
					shadowRadius: 8,
					elevation: 2,
				},
				errorBanner: {
					backgroundColor: `${colors.error}15`,
					color: colors.error,
					padding: spacing.sm + 2,
					borderRadius: 8,
					marginBottom: spacing.md,
					fontSize: fontSize.sm,
					textAlign: "center",
				},
				btns: {
					marginTop: spacing.md,
					gap: spacing.sm,
				},
			}),
		[colors],
	);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.header}>
					<Text style={styles.title}>Meta App</Text>
					<Text style={styles.subtitle}>
						{isLogin ? "Faça login para continuar" : "Crie sua conta"}
					</Text>
				</View>

				<View style={styles.form}>
					{error ? <Text style={styles.errorBanner}>{error}</Text> : null}

					{!isLogin ? (
						<ControlledFormInput
							control={control}
							name="name"
							label="Nome"
							placeholder="Seu nome"
						/>
					) : null}

					<ControlledFormInput
						control={control}
						name="email"
						label="Email"
						placeholder="seu@email.com"
						keyboardType="email-address"
					/>

					<ControlledFormInput
						control={control}
						name="password"
						label="Senha"
						placeholder="Mínimo 6 caracteres"
						secureTextEntry
					/>

					{!isLogin ? (
						<ControlledFormInput
							control={control}
							name="confirmPassword"
							label="Confirmar Senha"
							placeholder="Repita a senha"
							secureTextEntry
						/>
					) : null}

					<View style={styles.btns}>
						<CustomButton
							title={isLogin ? "Entrar" : "Criar Conta"}
							onPress={onSubmit}
							loading={loading}
						/>

						<CustomButton
							title={
								isLogin
									? "Não tem conta? Cadastre-se"
									: "Já tem conta? Faça login"
							}
							variant="secondary"
							onPress={onToggleMode}
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
