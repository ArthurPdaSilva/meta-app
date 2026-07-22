import { alert } from "@/shared/Alert";
import { useAuthStore } from "@/stores/authStore";
import { ChecklistScreen } from "./ChecklistScreen";
import { useChecklist } from "./hooks/useChecklist";
import { useDayProgress } from "./hooks/useDayProgress";

export function ChecklistContainer() {
	const {
		dayData,
		goals,
		loading,
		handleAddItem,
		handleToggleItem,
		handleRemoveItem,
		handleCreateGoal,
		handleDeleteGoal,
		handleConcludeDay,
	} = useChecklist();

	const { total, completed, percentage } = useDayProgress(dayData?.items ?? []);

	const logout = useAuthStore((s) => s.logout);

	function handleLogout() {
		alert.info("Você saiu da sua conta");
		logout();
	}

	return (
		<ChecklistScreen
			dayData={dayData}
			goals={goals}
			loading={loading}
			totalItems={total}
			completedItems={completed}
			progressPercentage={percentage}
			onAddItem={handleAddItem}
			onToggleItem={handleToggleItem}
			onRemoveItem={handleRemoveItem}
			onCreateGoal={handleCreateGoal}
			onDeleteGoal={handleDeleteGoal}
			onConcludeDay={handleConcludeDay}
			onLogout={handleLogout}
		/>
	);
}
