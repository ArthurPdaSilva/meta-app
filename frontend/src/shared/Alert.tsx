import Toast, {
	BaseToast,
	type BaseToastProps,
} from "react-native-toast-message";
import { borderRadius, colors, fontSize, spacing } from "@/styles/tokens";

const baseStyle: Record<string, unknown> = {
	borderLeftWidth: 4,
	height: "auto",
	minHeight: 60,
	paddingVertical: spacing.md,
	borderRadius: borderRadius.md,
	marginHorizontal: spacing.lg,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.15,
	shadowRadius: 8,
	elevation: 6,
	backgroundColor: colors.surface,
};

const contentContainerStyle = {
	paddingHorizontal: spacing.lg,
};

const text1Style = {
	fontSize: fontSize.md,
	fontWeight: "700" as const,
	color: colors.text,
};

const text2Style = {
	fontSize: fontSize.sm,
	color: colors.textSecondary,
};

export const toastConfig = {
	success: (props: BaseToastProps) => (
		<BaseToast
			{...props}
			style={[baseStyle, { borderLeftColor: colors.success }]}
			contentContainerStyle={contentContainerStyle}
			text1Style={text1Style}
			text2Style={text2Style}
		/>
	),
	error: (props: BaseToastProps) => (
		<BaseToast
			{...props}
			style={[baseStyle, { borderLeftColor: colors.error }]}
			contentContainerStyle={contentContainerStyle}
			text1Style={text1Style}
			text2Style={text2Style}
		/>
	),
	info: (props: BaseToastProps) => (
		<BaseToast
			{...props}
			style={[baseStyle, { borderLeftColor: colors.primary }]}
			contentContainerStyle={contentContainerStyle}
			text1Style={text1Style}
			text2Style={text2Style}
		/>
	),
};

function showSuccess(message: string) {
	Toast.show({ type: "success", text1: "Sucesso", text2: message });
}

function showError(message: string) {
	Toast.show({ type: "error", text1: "Erro", text2: message });
}

function showInfo(message: string) {
	Toast.show({ type: "info", text1: "Aviso", text2: message });
}

export const alert = {
	success: showSuccess,
	error: showError,
	info: showInfo,
};
