import { render } from "@testing-library/react-native";
import { AuthContainer } from "../../../features/auth/AuthContainer";

jest.mock("expo-router", () => ({
	useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("../../../features/auth/services/authApi", () => ({
	loginRequest: jest.fn(),
	registerRequest: jest.fn(),
}));

describe("AuthContainer", () => {
	it("renderiza AuthScreen com titulo Meta App", () => {
		const { getByText } = render(<AuthContainer />);
		expect(getByText("Meta App")).toBeTruthy();
	});

	it("renderiza botoes de login", () => {
		const { getByText } = render(<AuthContainer />);
		expect(getByText("Entrar")).toBeTruthy();
		expect(getByText("Não tem conta? Cadastre-se")).toBeTruthy();
	});
});
