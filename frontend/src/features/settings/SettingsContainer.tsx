import { useSettings } from "./hooks/useSettings";
import { SettingsScreen } from "./SettingsScreen";

export function SettingsContainer() {
	const {
		userName,
		email,
		loading,
		isDarkMode,
		control,
		onSubmit,
		handleLogout,
		handleBack,
		toggleDarkMode,
	} = useSettings();

	return (
		<SettingsScreen
			userName={userName}
			email={email}
			loading={loading}
			isDarkMode={isDarkMode}
			control={control}
			onSubmit={onSubmit}
			onLogout={handleLogout}
			onBack={handleBack}
			onToggleDarkMode={toggleDarkMode}
		/>
	);
}
