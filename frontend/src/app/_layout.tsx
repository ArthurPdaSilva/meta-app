import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/shared/Alert";

export default function RootLayout() {
	return (
		<>
			<StatusBar style="dark" />
			<Stack screenOptions={{ headerShown: false }} />
			<Toast config={toastConfig} />
		</>
	);
}
