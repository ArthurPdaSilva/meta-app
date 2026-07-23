import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/styles/theme";
import { borderRadius, fontSize, spacing } from "@/styles/tokens";

export interface CenterModalProps {
	visible: boolean;
	title: string;
	message: string;
	icon?: keyof typeof MaterialIcons.glyphMap;
	iconColor?: string;
	children?: React.ReactNode;
}

export function CenterModal({
	visible,
	title,
	message,
	icon,
	iconColor,
	children,
}: CenterModalProps) {
	const colors = useColors();

	const styles = useMemo(
		() =>
			StyleSheet.create({
				overlay: {
					flex: 1,
					backgroundColor: "rgba(0,0,0,0.5)",
					justifyContent: "center",
					alignItems: "center",
				},
				androidTop: {
					paddingTop: 24,
				},
				card: {
					width: "80%",
					backgroundColor: colors.surface,
					borderRadius: borderRadius.lg,
					padding: spacing.xl,
					alignItems: "center",
				},
				icon: {
					marginBottom: spacing.md,
				},
				title: {
					fontSize: fontSize.title,
					fontWeight: "700",
					color: colors.text,
					textAlign: "center",
					marginBottom: spacing.sm,
				},
				message: {
					fontSize: fontSize.md,
					color: colors.textSecondary,
					textAlign: "center",
					lineHeight: 20,
					marginBottom: spacing.xl,
				},
			}),
		[colors],
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			statusBarTranslucent
		>
			<View
				style={[styles.overlay, Platform.OS === "android" && styles.androidTop]}
			>
				<View style={styles.card}>
					{icon && (
						<MaterialIcons
							name={icon}
							size={40}
							color={iconColor ?? colors.primary}
							style={styles.icon}
						/>
					)}
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>
					{children}
				</View>
			</View>
		</Modal>
	);
}
