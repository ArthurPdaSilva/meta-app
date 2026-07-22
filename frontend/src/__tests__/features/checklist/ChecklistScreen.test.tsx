import { fireEvent, render } from "@testing-library/react-native";
import { Alert } from "react-native";
import type { ChecklistScreenProps } from "../../../features/checklist/ChecklistScreen";
import { ChecklistScreen } from "../../../features/checklist/ChecklistScreen";

function createProps(
	overrides: Partial<ChecklistScreenProps> = {},
): ChecklistScreenProps {
	return {
		dayData: { day: "2026-07-22", items: [] },
		goals: [],
		loading: false,
		totalItems: 0,
		completedItems: 0,
		progressPercentage: 0,
		onAddItem: jest.fn(),
		onToggleItem: jest.fn(),
		onRemoveItem: jest.fn(),
		onCreateGoal: jest.fn(),
		onDeleteGoal: jest.fn(),
		onAdvanceDay: jest.fn(),
		onLogout: jest.fn(),
		...overrides,
	};
}

describe("ChecklistScreen", () => {
	it("renderiza data formatada", () => {
		const { getByText } = render(<ChecklistScreen {...createProps()} />);
		expect(getByText(/quarta-feira/)).toBeTruthy();
	});

	it("renderiza mensagem vazia quando sem itens", () => {
		const { getByText } = render(<ChecklistScreen {...createProps()} />);
		expect(
			getByText("Nenhum item ainda. Adicione suas tarefas do dia!"),
		).toBeTruthy();
	});

	it("renderiza itens do checklist", () => {
		const props = createProps({
			dayData: {
				day: "2026-07-22",
				items: [
					{
						id: 1,
						title: "Tarefa 1",
						completed: false,
						day: "2026-07-22",
					},
					{
						id: 2,
						title: "Tarefa 2",
						completed: true,
						day: "2026-07-22",
					},
				],
			},
			totalItems: 2,
			completedItems: 1,
			progressPercentage: 50,
		});
		const { getByText } = render(<ChecklistScreen {...props} />);
		expect(getByText("Tarefa 1")).toBeTruthy();
		expect(getByText("Tarefa 2")).toBeTruthy();
		expect(getByText("1/2 concluídos")).toBeTruthy();
	});

	it("renderiza botoes de Nova Meta e Avancar Dia", () => {
		const { getByText } = render(<ChecklistScreen {...createProps()} />);
		expect(getByText("Nova Meta")).toBeTruthy();
		expect(getByText("Avançar Dia")).toBeTruthy();
	});

	it("mostra input de nova meta ao clicar em Nova Meta", () => {
		const { getByText, getByPlaceholderText } = render(
			<ChecklistScreen {...createProps()} />,
		);
		fireEvent.press(getByText("Nova Meta"));
		expect(getByPlaceholderText("Nome da nova meta...")).toBeTruthy();
	});

	it("chama onCreateGoal ao criar meta", () => {
		const onCreateGoal = jest.fn();
		const { getByText, getByPlaceholderText } = render(
			<ChecklistScreen {...createProps({ onCreateGoal })} />,
		);
		fireEvent.press(getByText("Nova Meta"));
		const input = getByPlaceholderText("Nome da nova meta...");
		fireEvent.changeText(input, "Exercitar");
		fireEvent.press(getByText("Criar"));
		expect(onCreateGoal).toHaveBeenCalledWith("Exercitar");
	});

	it("chama onAdvanceDay ao confirmar no Alert", () => {
		const onAdvanceDay = jest.fn();
		const alertSpy = jest
			.spyOn(Alert, "alert")
			.mockImplementation((_title, _msg, buttons) => {
				const btn = buttons?.[1];
				if (btn && "onPress" in btn && btn.onPress) btn.onPress();
			});

		const { getByText } = render(
			<ChecklistScreen {...createProps({ onAdvanceDay })} />,
		);
		fireEvent.press(getByText("Avançar Dia"));
		expect(onAdvanceDay).toHaveBeenCalled();
		alertSpy.mockRestore();
	});
});
