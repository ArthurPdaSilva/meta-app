import { render } from "@testing-library/react-native";
import { SettingsContainer } from "../../../features/settings/SettingsContainer";
import { useAuthStore } from "../../../stores/authStore";
import { useThemeStore } from "../../../stores/themeStore";

const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
	useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

jest.mock("react-hook-form", () => ({
	useForm: () => ({
		control: {},
		// biome-ignore lint/suspicious/noExplicitAny: mock
		handleSubmit: (fn: any) => {
			const mockData = { name: "Novo Nome" };
			return () => fn(mockData);
		},
	}),
	// biome-ignore lint/suspicious/noExplicitAny: mock
	Controller: ({ render }: { render: any }) =>
		render({
			field: { value: "", onChange: jest.fn() },
			fieldState: {},
		}),
	useController: () => ({
		field: { value: "", onChange: jest.fn() },
		fieldState: {},
	}),
}));

jest.mock("../../../features/settings/services/settingsApi", () => ({
	updateNameRequest: jest.fn(),
}));

jest.mock("../../../shared/Alert", () => ({
	alert: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

describe("SettingsContainer", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useAuthStore.setState({
			token: "token123",
			user: { id: 1, email: "a@a.com", name: "Arthur" },
			isAuthenticated: true,
		});
		useThemeStore.setState({ isDarkMode: false });
	});

	it("renderiza o container", () => {
		const { getByText } = render(<SettingsContainer />);
		expect(getByText("Configurações")).toBeTruthy();
	});
});
