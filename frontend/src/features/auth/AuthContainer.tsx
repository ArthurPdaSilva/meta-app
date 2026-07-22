import { AuthScreen } from "./AuthScreen";
import { useAuth } from "./hooks/useAuth";

export function AuthContainer() {
	const { mode, error, loading, control, onSubmit, toggleMode } = useAuth();

	return (
		<AuthScreen
			mode={mode}
			error={error}
			loading={loading}
			control={control}
			onSubmit={onSubmit}
			onToggleMode={toggleMode}
		/>
	);
}
