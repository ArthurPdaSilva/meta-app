import { render } from "@testing-library/react-native";
import { ChecklistContainer } from "../../../features/checklist/ChecklistContainer";
import { useAuthStore } from "../../../stores/authStore";

jest.mock("expo-router", () => ({
	useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../../../features/checklist/services/checklistApi", () => ({
	fetchDayData: jest.fn().mockResolvedValue({ day: "2026-07-22", items: [] }),
	fetchGoals: jest.fn().mockResolvedValue([]),
	addItem: jest.fn(),
	toggleItem: jest.fn(),
	removeItem: jest.fn(),
	createGoal: jest.fn(),
	deleteGoal: jest.fn(),
}));

describe("ChecklistContainer", () => {
	beforeEach(() => {
		useAuthStore.setState({
			token: "test-token",
			user: { id: 1, email: "a@a.com", name: "A" },
			isAuthenticated: true,
		});
	});

	afterAll(() => {
		useAuthStore.setState({
			token: null,
			user: null,
			isAuthenticated: false,
		});
	});

	it("renderiza ChecklistScreen", async () => {
		const { getByText, findByText } = render(<ChecklistContainer />);
		expect(await findByText(/Nenhum item ainda/)).toBeTruthy();
		expect(getByText("Nova Meta")).toBeTruthy();
		expect(getByText("Concluir por hoje")).toBeTruthy();
	});
});
