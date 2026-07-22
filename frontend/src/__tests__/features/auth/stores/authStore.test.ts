import { useAuthStore } from "../../../../stores/authStore";

describe("AuthStore", () => {
	beforeEach(() => {
		useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
	});

	it("inicia deslogado", () => {
		const state = useAuthStore.getState();
		expect(state.token).toBeNull();
		expect(state.user).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});

	it("setAuth define token e usuario", () => {
		const user = { id: 1, email: "a@a.com", name: "Arthur" };
		useAuthStore.getState().setAuth("token123", user);
		const state = useAuthStore.getState();
		expect(state.token).toBe("token123");
		expect(state.user).toEqual(user);
		expect(state.isAuthenticated).toBe(true);
	});

	it("logout limpa estado", () => {
		const user = { id: 1, email: "a@a.com", name: "Arthur" };
		useAuthStore.getState().setAuth("token123", user);
		useAuthStore.getState().logout();
		const state = useAuthStore.getState();
		expect(state.token).toBeNull();
		expect(state.user).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});
});
