import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
	get: async <T>(key: string): Promise<T | null> => {
		const value = await AsyncStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	},
	set: async <T>(key: string, value: T): Promise<void> => {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	},
	remove: async (key: string): Promise<void> => {
		await AsyncStorage.removeItem(key);
	},
};
