import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { CustomButton } from "@/shared/CustomButton";
import { borderRadius, colors, fontSize, spacing } from "@/styles/tokens";
import type { ChecklistItem, Goal } from "@/types";

export interface ChecklistScreenProps {
	dayData: {
		day: string;
		items: ChecklistItem[];
	} | null;
	goals: Goal[];
	loading: boolean;
	totalItems: number;
	completedItems: number;
	progressPercentage: number;
	onAddItem: (title: string, goalId?: number) => Promise<void>;
	onToggleItem: (id: number) => Promise<void>;
	onRemoveItem: (id: number) => Promise<void>;
	onCreateGoal: (title: string) => Promise<void>;
	onDeleteGoal: (id: number) => Promise<void>;
	onConcludeDay: () => Promise<void>;
	onLogout: () => void;
}

export function ChecklistScreen({
	dayData,
	goals,
	totalItems,
	completedItems,
	progressPercentage,
	onAddItem,
	onToggleItem,
	onRemoveItem,
	onCreateGoal,
	onDeleteGoal,
	onConcludeDay,
	onLogout,
}: ChecklistScreenProps) {
	const [newItemText, setNewItemText] = useState("");
	const [newGoalText, setNewGoalText] = useState("");
	const [showGoalInput, setShowGoalInput] = useState(false);
	const [removingId, setRemovingId] = useState<number | null>(null);
	const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);
	const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false);

	const handleAdd = () => {
		const text = newItemText.trim();
		if (!text) return;
		onAddItem(text);
		setNewItemText("");
	};

	const handleCreateGoal = () => {
		const text = newGoalText.trim();
		if (!text) return;
		onCreateGoal(text);
		setNewGoalText("");
		setShowGoalInput(false);
	};

	const handleConfirmRemove = async () => {
		if (removingId === null) return;
		await onRemoveItem(removingId);
		setRemovingId(null);
	};

	const handleConfirmDeleteGoal = async () => {
		if (deletingGoalId === null) return;
		await onDeleteGoal(deletingGoalId);
		setDeletingGoalId(null);
	};

	const formattedDay = dayData?.day
		? new Date(`${dayData.day}T12:00:00`).toLocaleDateString("pt-BR", {
				weekday: "long",
				day: "numeric",
				month: "long",
			})
		: "";

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<Text style={styles.dayTitle}>{formattedDay}</Text>
					<TouchableOpacity onPress={onLogout}>
						<MaterialCommunityIcons
							name="logout"
							size={22}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
				{totalItems > 0 ? (
					<Text style={styles.progressText}>
						{completedItems}/{totalItems} concluídos
					</Text>
				) : null}
				<View style={styles.progressBar}>
					<View
						style={[styles.progressFill, { width: `${progressPercentage}%` }]}
					/>
				</View>
			</View>

			<View style={styles.inputRow}>
				<TextInput
					style={styles.itemInput}
					value={newItemText}
					onChangeText={setNewItemText}
					placeholder="Adicionar item ao checklist..."
					placeholderTextColor={colors.textSecondary}
				/>
				<TouchableOpacity
					style={styles.addButton}
					onPress={handleAdd}
					disabled={!newItemText.trim()}
				>
					<MaterialCommunityIcons
						name="plus"
						size={24}
						color={colors.surface}
					/>
				</TouchableOpacity>
			</View>

			<FlatList
				data={dayData?.items ?? []}
				keyExtractor={(item) => String(item.id)}
				contentContainerStyle={styles.list}
				ListEmptyComponent={
					<Text style={styles.emptyText}>
						Nenhum item ainda. Adicione suas tarefas do dia!
					</Text>
				}
				renderItem={({ item }) => (
					<View style={styles.itemRow}>
						<TouchableOpacity
							style={styles.checkbox}
							onPress={() => onToggleItem(item.id)}
						>
							<MaterialCommunityIcons
								name={
									item.completed ? "checkbox-marked" : "checkbox-blank-outline"
								}
								size={24}
								color={item.completed ? colors.success : colors.textSecondary}
							/>
						</TouchableOpacity>
						<Text
							style={[styles.itemText, item.completed && styles.itemTextDone]}
						>
							{item.title}
						</Text>
						<TouchableOpacity onPress={() => setRemovingId(item.id)}>
							<MaterialCommunityIcons
								name="delete-outline"
								size={20}
								color={colors.error}
							/>
						</TouchableOpacity>
					</View>
				)}
			/>

			{goals.length > 0 ? (
				<View style={styles.goalsSection}>
					<Text style={styles.goalsTitle}>Minhas Metas</Text>
					{goals.map((goal) => (
						<View key={goal.id} style={styles.goalRow}>
							<MaterialCommunityIcons
								name="flag-outline"
								size={18}
								color={colors.primary}
							/>
							<Text style={styles.goalText}>{goal.title}</Text>
							<TouchableOpacity
								testID={`delete-goal-${goal.id}`}
								onPress={() => setDeletingGoalId(goal.id)}
							>
								<MaterialCommunityIcons
									name="delete-outline"
									size={18}
									color={colors.error}
								/>
							</TouchableOpacity>
						</View>
					))}
				</View>
			) : null}

			<View style={styles.footer}>
				{showGoalInput ? (
					<View style={styles.goalInputColumn}>
						<TextInput
							style={styles.goalsInput}
							value={newGoalText}
							onChangeText={setNewGoalText}
							placeholder="Nome da nova meta..."
							placeholderTextColor={colors.textSecondary}
						/>
						<View style={styles.goalButtonRow}>
							<CustomButton
								title="Cancelar"
								variant="secondary"
								onPress={() => setShowGoalInput(false)}
							/>
							<CustomButton
								title="Criar"
								onPress={handleCreateGoal}
								disabled={!newGoalText.trim()}
							/>
						</View>
					</View>
				) : (
					<View style={styles.footerButtons}>
						<CustomButton
							title="Nova Meta"
							variant="secondary"
							onPress={() => setShowGoalInput(true)}
						/>
						<CustomButton
							title="Concluir por hoje"
							variant="primary"
							onPress={() => setShowAdvanceConfirm(true)}
						/>
					</View>
				)}
			</View>

			<ConfirmModal
				visible={removingId !== null}
				title="Remover item"
				message="Tem certeza que deseja remover este item do checklist?"
				confirmLabel="Remover"
				cancelLabel="Cancelar"
				onConfirm={handleConfirmRemove}
				onCancel={() => setRemovingId(null)}
			/>
			<ConfirmModal
				visible={deletingGoalId !== null}
				title="Remover meta"
				message="Tem certeza que deseja remover esta meta?"
				confirmLabel="Remover"
				cancelLabel="Cancelar"
				onConfirm={handleConfirmDeleteGoal}
				onCancel={() => setDeletingGoalId(null)}
			/>
			<ConfirmModal
				visible={showAdvanceConfirm}
				title="Concluir por hoje"
				message="Finalizar o checklist de hoje?"
				confirmLabel="Concluir"
				confirmVariant="primary"
				cancelLabel="Cancelar"
				icon="check-circle"
				iconColor={colors.success}
				onConfirm={() => {
					onConcludeDay();
					setShowAdvanceConfirm(false);
				}}
				onCancel={() => setShowAdvanceConfirm(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		backgroundColor: colors.surface,
		paddingTop: 60,
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	dayTitle: {
		fontSize: fontSize.xl,
		fontWeight: "700",
		color: colors.text,
		marginBottom: spacing.xs,
		textTransform: "capitalize",
	},
	progressText: {
		fontSize: fontSize.sm,
		color: colors.textSecondary,
		marginBottom: spacing.sm,
	},
	progressBar: {
		height: 6,
		backgroundColor: colors.border,
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.success,
		borderRadius: 3,
	},
	inputRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		gap: spacing.sm,
		backgroundColor: colors.surface,
	},
	itemInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: borderRadius.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		fontSize: fontSize.md,
		color: colors.text,
		backgroundColor: colors.background,
	},
	goalsInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: borderRadius.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		fontSize: fontSize.md,
		color: colors.text,
		backgroundColor: colors.background,
	},
	addButton: {
		width: 44,
		height: 44,
		backgroundColor: colors.primary,
		borderRadius: borderRadius.sm,
		alignItems: "center",
		justifyContent: "center",
	},
	list: {
		padding: spacing.lg,
		flexGrow: 1,
	},
	emptyText: {
		textAlign: "center",
		color: colors.textSecondary,
		fontSize: fontSize.md,
		marginTop: spacing.xl,
	},
	itemRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		padding: spacing.md,
		borderRadius: borderRadius.sm,
		marginBottom: spacing.sm,
		gap: spacing.sm,
	},
	checkbox: {
		padding: 2,
	},
	itemText: {
		flex: 1,
		fontSize: fontSize.md,
		color: colors.text,
	},
	itemTextDone: {
		textDecorationLine: "line-through",
		color: colors.textSecondary,
	},
	goalsSection: {
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	goalsTitle: {
		fontSize: fontSize.sm,
		fontWeight: "700",
		color: colors.textSecondary,
		textTransform: "uppercase",
		marginBottom: spacing.sm,
	},
	goalRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	goalText: {
		flex: 1,
		fontSize: fontSize.md,
		color: colors.text,
	},
	footer: {
		padding: spacing.lg,
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	footerButtons: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	goalInputColumn: {
		gap: spacing.md,
	},
	goalButtonRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
});
