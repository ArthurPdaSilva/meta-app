import { fireEvent, render } from "@testing-library/react-native";
import { ConfirmModal } from "../../shared/ConfirmModal";

describe("ConfirmModal", () => {
	it("renderiza titulo e mensagem quando visivel", () => {
		const { getByText } = render(
			<ConfirmModal
				visible
				title="Remover item"
				message="Tem certeza?"
				onConfirm={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(getByText("Remover item")).toBeTruthy();
		expect(getByText("Tem certeza?")).toBeTruthy();
	});

	it("renderiza botoes padrao", () => {
		const { getByText } = render(
			<ConfirmModal
				visible
				title="Remover"
				message="Confirma?"
				onConfirm={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(getByText("Confirmar")).toBeTruthy();
		expect(getByText("Cancelar")).toBeTruthy();
	});

	it("chama onConfirm ao pressionar Confirmar", () => {
		const onConfirm = jest.fn();
		const { getByText } = render(
			<ConfirmModal
				visible
				title="Remover"
				message="Confirma?"
				onConfirm={onConfirm}
				onCancel={jest.fn()}
			/>,
		);
		fireEvent.press(getByText("Confirmar"));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("chama onCancel ao pressionar Cancelar", () => {
		const onCancel = jest.fn();
		const { getByText } = render(
			<ConfirmModal
				visible
				title="Remover"
				message="Confirma?"
				onConfirm={jest.fn()}
				onCancel={onCancel}
			/>,
		);
		fireEvent.press(getByText("Cancelar"));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it("renderiza texto personalizado dos botoes", () => {
		const { getByText } = render(
			<ConfirmModal
				visible
				title="Remover"
				message="Confirma?"
				confirmLabel="Sim"
				cancelLabel="Não"
				onConfirm={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(getByText("Sim")).toBeTruthy();
		expect(getByText("Não")).toBeTruthy();
	});

	it("nao renderiza quando visible e false", () => {
		const { queryByText } = render(
			<ConfirmModal
				visible={false}
				title="Invisivel"
				message="Nao deve aparecer"
				onConfirm={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(queryByText("Invisivel")).toBeNull();
	});
});
