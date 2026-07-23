import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ThemeState {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			isDarkMode: false,
			toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
		}),
		{
			name: "theme-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
