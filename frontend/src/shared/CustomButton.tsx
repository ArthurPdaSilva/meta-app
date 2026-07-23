import { useMemo } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { useColors } from "@/styles/theme";
import { borderRadius, fontSize, spacing } from "@/styles/tokens";

export interface CustomButtonProps {
	title: string;
	onPress: () => void;
	variant?: "primary" | "secondary" | "danger";
	loading?: boolean;
	disabled?: boolean;
}

export function CustomButton({
	title,
	onPress,
	variant = "primary",
	loading = false,
	disabled = false,
}: CustomButtonProps) {
	const colors = useColors();
	const isDisabled = disabled || loading;

	const styles = useMemo(
		() =>
			StyleSheet.create({
				base: {
					paddingVertical: spacing.md - 2,
					paddingHorizontal: spacing.lg,
					borderRadius: borderRadius.md,
					alignItems: "center",
					justifyContent: "center",
					minHeight: 48,
				},
				primary: {
					backgroundColor: colors.primary,
				},
				secondary: {
					backgroundColor: "transparent",
					borderWidth: 1.5,
					borderColor: colors.primary,
				},
				danger: {
					backgroundColor: colors.error,
				},
				disabled: {
					opacity: 0.5,
				},
				text: {
					color: colors.surface,
					fontSize: fontSize.md,
					fontWeight: "600",
				},
				secondaryText: {
					color: colors.primary,
				},
			}),
		[colors],
	);

	return (
		<TouchableOpacity
			style={[
				styles.base,
				variant === "primary" && styles.primary,
				variant === "secondary" && styles.secondary,
				variant === "danger" && styles.danger,
				isDisabled && styles.disabled,
			]}
			onPress={onPress}
			disabled={isDisabled}
			activeOpacity={0.7}
		>
			{loading ? (
				<ActivityIndicator
					testID="loading-indicator"
					color={variant === "secondary" ? colors.primary : colors.surface}
				/>
			) : (
				<Text
					style={[styles.text, variant === "secondary" && styles.secondaryText]}
				>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
}
