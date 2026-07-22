import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, fontSize, spacing } from "@/styles/tokens";
import { CustomButton } from "./CustomButton";

export interface ConfirmModalProps {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmVariant?: "primary" | "danger";
}

export function ConfirmModal({
	visible,
	title,
	message,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
	onConfirm,
	onCancel,
	confirmVariant = "primary",
}: ConfirmModalProps) {
	return (
		<Modal visible={visible} transparent animationType="fade">
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onCancel}
			>
				<TouchableOpacity
					style={styles.content}
					activeOpacity={1}
					onPress={() => {}}
				>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>
					<View style={styles.actions}>
						<View style={styles.buttonWrapper}>
							<CustomButton
								title={cancelText}
								variant="secondary"
								onPress={onCancel}
							/>
						</View>
						<View style={styles.buttonWrapper}>
							<CustomButton
								title={confirmText}
								variant={confirmVariant}
								onPress={onConfirm}
							/>
						</View>
					</View>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.lg,
	},
	content: {
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		padding: spacing.lg,
		width: "100%",
		maxWidth: 340,
	},
	title: {
		fontSize: fontSize.lg,
		fontWeight: "700",
		color: colors.text,
		marginBottom: spacing.sm,
	},
	message: {
		fontSize: fontSize.md,
		color: colors.textSecondary,
		marginBottom: spacing.lg,
		lineHeight: 22,
	},
	actions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	buttonWrapper: {
		flex: 1,
	},
});
