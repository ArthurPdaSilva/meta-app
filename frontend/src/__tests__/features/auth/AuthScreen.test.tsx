import { fireEvent, render } from "@testing-library/react-native";
import type { AuthScreenProps } from "../../../features/auth/AuthScreen";
import { AuthScreen } from "../../../features/auth/AuthScreen";

jest.mock("../../../shared/ControlledFormInput", () => ({
	ControlledFormInput: ({ label }: { label: string }) => {
		const { Text } = require("react-native");
		return <Text>{label}</Text>;
	},
}));

function createProps(
	overrides: Partial<AuthScreenProps> = {},
): AuthScreenProps {
	return {
		mode: "login",
		error: null,
		loading: false,
		control: {} as AuthScreenProps["control"],
		onSubmit: jest.fn(),
		onToggleMode: jest.fn(),
		...overrides,
	};
}

describe("AuthScreen", () => {
	it("renderiza titulo e subtitulo no login", () => {
		const { getByText } = render(<AuthScreen {...createProps()} />);
		expect(getByText("Meta App")).toBeTruthy();
		expect(getByText("Faça login para continuar")).toBeTruthy();
	});

	it("renderiza subtitulo de registro no modo register", () => {
		const { getByText } = render(
			<AuthScreen {...createProps({ mode: "register" })} />,
		);
		expect(getByText("Crie sua conta")).toBeTruthy();
	});

	it("mostra campos de nome e confirmar senha no modo register", () => {
		const { getByText } = render(
			<AuthScreen {...createProps({ mode: "register" })} />,
		);
		expect(getByText("Nome")).toBeTruthy();
		expect(getByText("Confirmar Senha")).toBeTruthy();
	});

	it("nao mostra campos de nome e confirmar senha no login", () => {
		const { queryByText } = render(<AuthScreen {...createProps()} />);
		expect(queryByText("Nome")).toBeNull();
		expect(queryByText("Confirmar Senha")).toBeNull();
	});

	it("exibe error banner quando error nao e nulo", () => {
		const { getByText } = render(
			<AuthScreen {...createProps({ error: "Email inválido" })} />,
		);
		expect(getByText("Email inválido")).toBeTruthy();
	});

	it("chama onSubmit ao clicar em Entrar", () => {
		const onSubmit = jest.fn();
		const { getByText } = render(<AuthScreen {...createProps({ onSubmit })} />);
		fireEvent.press(getByText("Entrar"));
		expect(onSubmit).toHaveBeenCalled();
	});

	it("chama onToggleMode ao clicar no botao de alternar", () => {
		const onToggleMode = jest.fn();
		const { getByText } = render(
			<AuthScreen {...createProps({ onToggleMode })} />,
		);
		fireEvent.press(getByText("Não tem conta? Cadastre-se"));
		expect(onToggleMode).toHaveBeenCalled();
	});

	it("mostra botao de Criar Conta no modo register", () => {
		const { getByText } = render(
			<AuthScreen {...createProps({ mode: "register" })} />,
		);
		expect(getByText("Criar Conta")).toBeTruthy();
	});

	it("mostra botao de login no modo register", () => {
		const { getByText } = render(
			<AuthScreen {...createProps({ mode: "register" })} />,
		);
		expect(getByText("Já tem conta? Faça login")).toBeTruthy();
	});
});
