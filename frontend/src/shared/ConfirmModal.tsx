import { StyleSheet, View } from "react-native";
import { spacing } from "@/styles/tokens";
import { CenterModal } from "./CenterModal";
import { CustomButton } from "./CustomButton";

export interface ConfirmModalProps {
	visible: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	confirmVariant?: "primary" | "secondary" | "danger";
	onCancel: () => void;
	icon?: keyof typeof import("@expo/vector-icons").MaterialIcons.glyphMap;
	iconColor?: string;
}

export function ConfirmModal({
	visible,
	title,
	message,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	onConfirm,
	onCancel,
	icon,
	iconColor,
	confirmVariant,
}: ConfirmModalProps) {
	return (
		<CenterModal
			visible={visible}
			title={title}
			message={message}
			icon={icon}
			iconColor={iconColor}
		>
			<View style={styles.actions}>
				<CustomButton
					onPress={onCancel}
					variant="secondary"
					title={cancelLabel}
				/>
				<CustomButton
					onPress={onConfirm}
					variant={confirmVariant ?? "danger"}
					title={confirmLabel}
				/>
			</View>
		</CenterModal>
	);
}

const styles = StyleSheet.create({
	actions: {
		flexDirection: "row",
		gap: spacing.md,
		width: "100%",
	},
});
