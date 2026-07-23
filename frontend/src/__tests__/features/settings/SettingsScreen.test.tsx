import { fireEvent, render } from "@testing-library/react-native";
import { SettingsScreen } from "../../../features/settings/SettingsScreen";

jest.mock("react-hook-form", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: mock
	Controller: ({ render }: { render: any }) =>
		render({
			field: { value: "", onChange: jest.fn() },
			fieldState: {},
		}),
}));

describe("SettingsScreen", () => {
	const defaultProps = {
		userName: "Arthur",
		email: "a@a.com",
		loading: false,
		isDarkMode: false,
		control: {} as never,
		onSubmit: jest.fn(),
		onLogout: jest.fn(),
		onBack: jest.fn(),
		onToggleDarkMode: jest.fn(),
	};

	it("renderiza titulo Configurações", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("Configurações")).toBeTruthy();
	});

	it("renderiza botao de voltar", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("← Voltar")).toBeTruthy();
	});

	it("renderiza seção Perfil", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("Perfil")).toBeTruthy();
	});

	it("renderiza seção Aparência", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("Aparência")).toBeTruthy();
	});

	it("renderiza opção Modo escuro", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("Modo escuro")).toBeTruthy();
	});

	it("renderiza botao Sair da conta", () => {
		const { getByText } = render(<SettingsScreen {...defaultProps} />);
		expect(getByText("Sair da conta")).toBeTruthy();
	});

	it("chama onBack ao pressionar Voltar", () => {
		const onBack = jest.fn();
		const { getByText } = render(
			<SettingsScreen {...defaultProps} onBack={onBack} />,
		);
		fireEvent.press(getByText("← Voltar"));
		expect(onBack).toHaveBeenCalled();
	});

	it("chama onLogout ao pressionar Sair da conta", () => {
		const onLogout = jest.fn();
		const { getByText } = render(
			<SettingsScreen {...defaultProps} onLogout={onLogout} />,
		);
		fireEvent.press(getByText("Sair da conta"));
		expect(onLogout).toHaveBeenCalled();
	});
});
