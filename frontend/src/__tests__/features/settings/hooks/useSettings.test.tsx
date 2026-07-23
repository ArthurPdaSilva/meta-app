import { act, renderHook } from "@testing-library/react-native";
import { useSettings } from "../../../../features/settings/hooks/useSettings";
import { useAuthStore } from "../../../../stores/authStore";
import { useThemeStore } from "../../../../stores/themeStore";

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

const mockUpdateNameRequest = jest.fn();
jest.mock("../../../../features/settings/services/settingsApi", () => ({
	updateNameRequest: (...args: unknown[]) => mockUpdateNameRequest(...args),
}));

jest.mock("../../../../shared/Alert", () => ({
	alert: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

function setupStores() {
	useAuthStore.setState({
		token: "token123",
		user: { id: 1, email: "a@a.com", name: "Arthur" },
		isAuthenticated: true,
	});
	useThemeStore.setState({ isDarkMode: false });
}

describe("useSettings - estado inicial", () => {
	beforeEach(setupStores);

	it("retorna dados do usuario", () => {
		const { result } = renderHook(() => useSettings());
		expect(result.current.userName).toBe("Arthur");
		expect(result.current.email).toBe("a@a.com");
	});

	it("retorna estado do dark mode", () => {
		const { result } = renderHook(() => useSettings());
		expect(result.current.isDarkMode).toBe(false);
	});

	it("handleBack chama router.back", () => {
		const { result } = renderHook(() => useSettings());
		act(() => result.current.handleBack());
		expect(mockBack).toHaveBeenCalled();
	});
});

describe("useSettings - toggleDarkMode", () => {
	beforeEach(setupStores);

	it("alterna o estado", () => {
		useThemeStore.getState().toggleDarkMode();
		expect(useThemeStore.getState().isDarkMode).toBe(true);
	});
});

describe("useSettings - handleLogout", () => {
	beforeEach(setupStores);

	it("limpa auth e navega para raiz", () => {
		const { result } = renderHook(() => useSettings());
		act(() => result.current.handleLogout());
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(mockReplace).toHaveBeenCalledWith("/");
	});
});

describe("useSettings - onSubmit", () => {
	beforeEach(setupStores);

	it("chama updateNameRequest e atualiza auth", async () => {
		mockUpdateNameRequest.mockResolvedValueOnce({
			id: 1,
			email: "a@a.com",
			name: "Novo Nome",
		});
		const { result } = renderHook(() => useSettings());
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mockUpdateNameRequest).toHaveBeenCalledWith("token123", "Novo Nome");
		expect(useAuthStore.getState().user?.name).toBe("Novo Nome");
	});

	it("mostra erro quando falha", async () => {
		mockUpdateNameRequest.mockRejectedValueOnce(
			new Error("Falha na atualização"),
		);
		const { result } = renderHook(() => useSettings());
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mockUpdateNameRequest).toHaveBeenCalled();
	});
});
