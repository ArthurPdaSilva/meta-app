import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/shared/Alert";
import { useThemeStore } from "@/stores/themeStore";

export default function RootLayout() {
	const isDarkMode = useThemeStore((s) => s.isDarkMode);

	return (
		<>
			<StatusBar style={isDarkMode ? "light" : "dark"} />
			<Stack screenOptions={{ headerShown: false }} />
			<Toast config={toastConfig} />
		</>
	);
}
