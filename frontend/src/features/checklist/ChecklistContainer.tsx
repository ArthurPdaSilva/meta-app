import { useRouter } from "expo-router";
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

	const router = useRouter();

	function handleOpenSettings() {
		router.push("/settings");
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
			onOpenSettings={handleOpenSettings}
		/>
	);
}
