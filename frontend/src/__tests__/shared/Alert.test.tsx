import { render } from "@testing-library/react-native";
import Toast from "react-native-toast-message";
import { alert, toastConfig } from "../../shared/Alert";

describe("Alert", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("exporta toastConfig com success, error e info", () => {
		expect(toastConfig).toHaveProperty("success");
		expect(toastConfig).toHaveProperty("error");
		expect(toastConfig).toHaveProperty("info");
	});

	it("alert.success chama Toast.show com tipo success", () => {
		alert.success("Operação concluída");
		expect(Toast.show).toHaveBeenCalledWith({
			type: "success",
			text1: "Sucesso",
			text2: "Operação concluída",
		});
	});

	it("alert.error chama Toast.show com tipo error", () => {
		alert.error("Algo deu errado");
		expect(Toast.show).toHaveBeenCalledWith({
			type: "error",
			text1: "Erro",
			text2: "Algo deu errado",
		});
	});

	it("alert.info chama Toast.show com tipo info", () => {
		alert.info("Atenção aos prazos");
		expect(Toast.show).toHaveBeenCalledWith({
			type: "info",
			text1: "Aviso",
			text2: "Atenção aos prazos",
		});
	});

	it("toastConfig.success renderiza BaseToast com texto", () => {
		const SuccessComponent = toastConfig.success;
		const { getByText } = render(
			<SuccessComponent
				text1="Sucesso"
				text2="Tudo certo"
				onPress={jest.fn()}
			/>,
		);
		expect(getByText("Sucesso")).toBeTruthy();
		expect(getByText("Tudo certo")).toBeTruthy();
	});

	it("toastConfig.error renderiza BaseToast com texto", () => {
		const ErrorComponent = toastConfig.error;
		const { getByText } = render(
			<ErrorComponent text1="Erro" text2="Falhou" onPress={jest.fn()} />,
		);
		expect(getByText("Erro")).toBeTruthy();
		expect(getByText("Falhou")).toBeTruthy();
	});

	it("toastConfig.info renderiza BaseToast com texto", () => {
		const InfoComponent = toastConfig.info;
		const { getByText } = render(
			<InfoComponent text1="Aviso" text2="Informação" onPress={jest.fn()} />,
		);
		expect(getByText("Aviso")).toBeTruthy();
		expect(getByText("Informação")).toBeTruthy();
	});
});
