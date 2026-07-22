import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { CustomButton } from "@/shared/CustomButton";
import { FormInput } from "@/shared/FormInput";
import { colors, fontSize, spacing } from "@/styles/tokens";

export interface AuthScreenProps {
	mode: "login" | "register";
	error: string | null;
	loading: boolean;
	formData: {
		email: string;
		password: string;
		name: string;
		confirmPassword: string;
	};
	formErrors: {
		email?: string;
		password?: string;
		name?: string;
		confirmPassword?: string;
	};
	onFieldChange: (field: string, value: string) => void;
	onSubmit: () => void;
	onToggleMode: () => void;
}

export function AuthScreen({
	mode,
	error,
	loading,
	formData,
	formErrors,
	onFieldChange,
	onSubmit,
	onToggleMode,
}: AuthScreenProps) {
	const isLogin = mode === "login";

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
						<FormInput
							label="Nome"
							value={formData.name}
							onChangeText={(v) => onFieldChange("name", v)}
							placeholder="Seu nome"
							error={formErrors.name}
						/>
					) : null}

					<FormInput
						label="Email"
						value={formData.email}
						onChangeText={(v) => onFieldChange("email", v)}
						placeholder="seu@email.com"
						keyboardType="email-address"
						error={formErrors.email}
					/>

					<FormInput
						label="Senha"
						value={formData.password}
						onChangeText={(v) => onFieldChange("password", v)}
						placeholder="Mínimo 6 caracteres"
						secureTextEntry
						error={formErrors.password}
					/>

					{!isLogin ? (
						<FormInput
							label="Confirmar Senha"
							value={formData.confirmPassword}
							onChangeText={(v) => onFieldChange("confirmPassword", v)}
							placeholder="Repita a senha"
							secureTextEntry
							error={formErrors.confirmPassword}
						/>
					) : null}

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
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
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
});
