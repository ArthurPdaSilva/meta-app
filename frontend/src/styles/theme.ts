import { useThemeStore } from "@/stores/themeStore";
import { colors as lightColors } from "./tokens";

export const darkColors = {
	primary: "#818CF8",
	primaryLight: "#A5B4FC",
	background: "#111827",
	surface: "#1F2937",
	text: "#F9FAFB",
	textSecondary: "#9CA3AF",
	border: "#374151",
	error: "#F87171",
	success: "#4ADE80",
	warning: "#FBBF24",
};

export function useColors() {
	const isDarkMode = useThemeStore((s) => s.isDarkMode);
	return isDarkMode ? darkColors : lightColors;
}
