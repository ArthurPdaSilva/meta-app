import { useThemeStore } from "../../stores/themeStore";

describe("ThemeStore", () => {
	beforeEach(() => {
		useThemeStore.setState({ isDarkMode: false });
	});

	it("inicia com dark mode desligado", () => {
		const state = useThemeStore.getState();
		expect(state.isDarkMode).toBe(false);
	});

	it("toggleDarkMode alterna o valor", () => {
		useThemeStore.getState().toggleDarkMode();
		expect(useThemeStore.getState().isDarkMode).toBe(true);
		useThemeStore.getState().toggleDarkMode();
		expect(useThemeStore.getState().isDarkMode).toBe(false);
	});
});
