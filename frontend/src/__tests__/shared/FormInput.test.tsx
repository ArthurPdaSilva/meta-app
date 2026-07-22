import { fireEvent, render } from "@testing-library/react-native";
import { FormInput } from "../../shared/FormInput";

describe("FormInput", () => {
	it("renderiza label e input", () => {
		const { getByText, getByPlaceholderText } = render(
			<FormInput
				label="Email"
				value=""
				onChangeText={() => {}}
				placeholder="seu@email.com"
			/>,
		);
		expect(getByText("Email")).toBeTruthy();
		expect(getByPlaceholderText("seu@email.com")).toBeTruthy();
	});

	it("chama onChangeText ao digitar", () => {
		const onChangeText = jest.fn();
		const { getByPlaceholderText } = render(
			<FormInput
				label="Email"
				value=""
				onChangeText={onChangeText}
				placeholder="seu@email.com"
			/>,
		);
		fireEvent.changeText(
			getByPlaceholderText("seu@email.com"),
			"test@test.com",
		);
		expect(onChangeText).toHaveBeenCalledWith("test@test.com");
	});

	it("exibe mensagem de erro", () => {
		const { getByText } = render(
			<FormInput
				label="Email"
				value=""
				onChangeText={() => {}}
				error="Email inválido"
			/>,
		);
		expect(getByText("Email inválido")).toBeTruthy();
	});

	it("aplica estilo de erro no input quando error existe", () => {
		const { getByDisplayValue } = render(
			<FormInput
				label="Email"
				value="invalido"
				onChangeText={() => {}}
				error="Erro"
			/>,
		);
		const input = getByDisplayValue("invalido");
		expect(input).toBeTruthy();
	});

	it("renderiza com secureTextEntry", () => {
		const { getByPlaceholderText } = render(
			<FormInput
				label="Senha"
				value=""
				onChangeText={() => {}}
				placeholder="Senha"
				secureTextEntry
			/>,
		);
		const input = getByPlaceholderText("Senha");
		expect(input.props.secureTextEntry).toBe(true);
	});

	it("renderiza sem erro quando error e undefined", () => {
		const { queryByText } = render(
			<FormInput
				label="Email"
				value=""
				onChangeText={() => {}}
				placeholder="Email"
			/>,
		);
		expect(queryByText(/error/i)).toBeNull();
	});
});
