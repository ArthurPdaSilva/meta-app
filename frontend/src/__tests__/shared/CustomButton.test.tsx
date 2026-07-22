import { fireEvent, render } from "@testing-library/react-native";
import { CustomButton } from "../../shared/CustomButton";

describe("CustomButton", () => {
	it("renderiza o titulo", async () => {
		const { getByText } = await render(
			<CustomButton title="Entrar" onPress={() => {}} />,
		);
		expect(await getByText("Entrar")).toBeTruthy();
	});

	it("chama onPress ao clicar", async () => {
		const onPress = jest.fn();
		const { getByText } = await render(
			<CustomButton title="Entrar" onPress={onPress} />,
		);
		fireEvent.press(await getByText("Entrar"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("nao chama onPress quando desabilitado", async () => {
		const onPress = jest.fn();
		const { getByText } = await render(
			<CustomButton title="Entrar" onPress={onPress} disabled />,
		);
		fireEvent.press(await getByText("Entrar"));
		expect(onPress).not.toHaveBeenCalled();
	});

	it("nao chama onPress quando loading", async () => {
		const onPress = jest.fn();
		const { getByTestId } = await render(
			<CustomButton title="Entrar" onPress={onPress} loading />,
		);
		const activityIndicator = await getByTestId("loading-indicator");
		expect(activityIndicator).toBeTruthy();
		expect(onPress).not.toHaveBeenCalled();
	});
});
