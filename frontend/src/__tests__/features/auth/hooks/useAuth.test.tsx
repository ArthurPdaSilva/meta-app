import { act, renderHook } from "@testing-library/react-native";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { useAuthStore } from "../../../../stores/authStore";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
	useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("react-hook-form", () => ({
	useForm: () => ({
		control: {},
		// biome-ignore lint/suspicious/noExplicitAny: mock
		handleSubmit: (fn: any) => {
			const mockData = {
				email: "a@a.com",
				password: "123456",
				name: "Test",
				confirmPassword: "123456",
			};
			return () => fn(mockData);
		},
		reset: jest.fn(),
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

const mockLoginRequest = jest.fn();
const mockRegisterRequest = jest.fn();
jest.mock("../../../../features/auth/services/authApi", () => ({
	loginRequest: (...args: unknown[]) => mockLoginRequest(...args),
	registerRequest: (...args: unknown[]) => mockRegisterRequest(...args),
}));

describe("useAuth", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useAuthStore.setState({
			token: null,
			user: null,
			isAuthenticated: false,
		});
	});

	it("inicia no modo login", () => {
		const { result } = renderHook(() => useAuth());
		expect(result.current.mode).toBe("login");
	});

	it("alterna para registro e volta", () => {
		const { result } = renderHook(() => useAuth());
		act(() => result.current.toggleMode());
		expect(result.current.mode).toBe("register");
		act(() => result.current.toggleMode());
		expect(result.current.mode).toBe("login");
	});

	it("limpa erro ao alternar modo", () => {
		const { result } = renderHook(() => useAuth());
		act(() => result.current.toggleMode());
		expect(result.current.error).toBeNull();
	});

	it("chama loginRequest ao submeter no modo login", async () => {
		mockLoginRequest.mockResolvedValueOnce({
			token: "abc",
			user: { id: 1, email: "a@a.com", name: "A" },
		});
		const { result } = renderHook(() => useAuth());
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mockLoginRequest).toHaveBeenCalled();
	});

	it("chama registerRequest ao submeter no modo register", async () => {
		mockRegisterRequest.mockResolvedValueOnce({
			token: "abc",
			user: { id: 1, email: "a@a.com", name: "A" },
		});
		const { result } = renderHook(() => useAuth());
		act(() => result.current.toggleMode());
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(mockRegisterRequest).toHaveBeenCalled();
	});

	it("define error quando submit falha", async () => {
		mockLoginRequest.mockRejectedValueOnce(new Error("Email inválido"));
		const { result } = renderHook(() => useAuth());
		await act(async () => {
			await result.current.onSubmit();
		});
		expect(result.current.error).toBe("Email inválido");
	});
});
