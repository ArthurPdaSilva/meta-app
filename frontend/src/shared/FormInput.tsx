import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useColors } from "@/styles/theme";
import { borderRadius, fontSize, spacing } from "@/styles/tokens";

export interface FormInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	secureTextEntry?: boolean;
	error?: string;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	keyboardType?: "default" | "email-address";
}

export function FormInput({
	label,
	value,
	onChangeText,
	placeholder,
	secureTextEntry = false,
	error,
	autoCapitalize = "none",
	keyboardType = "default",
}: FormInputProps) {
	const colors = useColors();

	const styles = useMemo(
		() =>
			StyleSheet.create({
				container: {
					marginBottom: spacing.md,
				},
				label: {
					fontSize: fontSize.sm,
					fontWeight: "600",
					color: colors.text,
					marginBottom: spacing.xs,
				},
				input: {
					borderWidth: 1,
					borderColor: colors.border,
					borderRadius: borderRadius.sm,
					paddingHorizontal: spacing.md,
					paddingVertical: spacing.sm + 2,
					fontSize: fontSize.md,
					color: colors.text,
					backgroundColor: colors.surface,
				},
				inputError: {
					borderColor: colors.error,
				},
				error: {
					color: colors.error,
					fontSize: fontSize.sm,
					marginTop: spacing.xs,
				},
			}),
		[colors],
	);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={[styles.input, error ? styles.inputError : null]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={colors.textSecondary}
				secureTextEntry={secureTextEntry}
				autoCapitalize={autoCapitalize}
				keyboardType={keyboardType}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
		</View>
	);
}
