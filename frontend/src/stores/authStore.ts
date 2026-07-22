import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types";

export interface AuthState {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setAuth: (token: string, user: User) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			isAuthenticated: false,
			setAuth: (token: string, user: User) =>
				set({ token, user, isAuthenticated: true }),
			logout: () => set({ token: null, user: null, isAuthenticated: false }),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
