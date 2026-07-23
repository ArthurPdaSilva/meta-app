import type { Control, FieldValues } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { ControlledFormInput } from "@/shared/ControlledFormInput";
import { CustomButton } from "@/shared/CustomButton";
import { useColors } from "@/styles/theme";
import { fontSize, spacing } from "@/styles/tokens";
import type { SettingsFormData } from "./hooks/useSettings";

export interface SettingsScreenProps {
	userName: string;
	email: string;
	loading: boolean;
	isDarkMode: boolean;
	control: Control<SettingsFormData, FieldValues>;
	onSubmit: () => void;
	onLogout: () => void;
	onBack: () => void;
	onToggleDarkMode: () => void;
}

export function SettingsScreen({
	loading,
	isDarkMode,
	control,
	onSubmit,
	onLogout,
	onBack,
	onToggleDarkMode,
}: SettingsScreenProps) {
	const colors = useColors();

	return (
		<KeyboardAvoidingView
			style={[styles.container, { backgroundColor: colors.background }]}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.header}>
					<TouchableOpacity onPress={onBack} style={styles.backButton}>
						<Text style={[styles.backText, { color: colors.primary }]}>
							← Voltar
						</Text>
					</TouchableOpacity>
					<Text style={[styles.title, { color: colors.text }]}>
						Configurações
					</Text>
				</View>

				<View
					style={[
						styles.section,
						{
							backgroundColor: colors.surface,
							borderColor: colors.border,
						},
					]}
				>
					<Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
						Perfil
					</Text>

					<ControlledFormInput
						control={control}
						name="name"
						label="Nome"
						placeholder="Seu nome"
					/>

					<CustomButton
						title="Atualizar"
						onPress={onSubmit}
						loading={loading}
					/>
				</View>

				<View
					style={[
						styles.section,
						{
							backgroundColor: colors.surface,
							borderColor: colors.border,
						},
					]}
				>
					<Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
						Aparência
					</Text>

					<View style={styles.row}>
						<Text style={[styles.rowLabel, { color: colors.text }]}>
							Modo escuro
						</Text>
						<Switch
							trackColor={{ false: colors.border, true: colors.primary }}
							thumbColor={isDarkMode ? colors.surface : "#f4f3f4"}
							onValueChange={onToggleDarkMode}
							value={isDarkMode}
						/>
					</View>
				</View>

				<View
					style={[
						styles.section,
						{
							backgroundColor: colors.surface,
							borderColor: colors.border,
						},
					]}
				>
					<CustomButton
						title="Sair da conta"
						variant="danger"
						onPress={onLogout}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 60,
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl,
		gap: spacing.lg,
	},
	header: {
		marginBottom: spacing.sm,
	},
	backButton: {
		marginBottom: spacing.md,
	},
	backText: {
		fontSize: fontSize.md,
		fontWeight: "600",
	},
	title: {
		fontSize: fontSize.title,
		fontWeight: "800",
	},
	section: {
		borderRadius: 16,
		padding: spacing.lg,
		borderWidth: 1,
		gap: spacing.md,
	},
	sectionTitle: {
		fontSize: fontSize.sm,
		fontWeight: "700",
		textTransform: "uppercase",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rowLabel: {
		fontSize: fontSize.md,
	},
});
