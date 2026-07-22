import { useCallback, useState } from "react";
import { AuthScreen } from "./AuthScreen";
import { useAuth } from "./hooks/useAuth";
import {
	type LoginFormData,
	loginSchema,
	type RegisterFormData,
	registerSchema,
} from "./schemas/authSchemas";

interface AuthFormData {
	email: string;
	password: string;
	name: string;
	confirmPassword: string;
}

const initialLogin: LoginFormData = { email: "", password: "" };
const initialRegister: RegisterFormData = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export function AuthContainer() {
	const { mode, error, loading, handleSubmit, toggleMode } = useAuth();
	const isLogin = mode === "login";

	const [formData, setFormData] = useState<AuthFormData>({
		...initialLogin,
		name: "",
		confirmPassword: "",
	});
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const onFieldChange = useCallback((field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setFormErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}, []);

	const onSubmit = useCallback(() => {
		const schema = isLogin ? loginSchema : registerSchema;
		const result = schema.safeParse(formData);

		if (!result.success) {
			const errors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as string;
				if (!errors[field]) {
					errors[field] = issue.message;
				}
			}
			setFormErrors(errors);
			return;
		}

		setFormErrors({});
		handleSubmit(result.data);
	}, [isLogin, formData, handleSubmit]);

	const handleToggle = useCallback(() => {
		toggleMode();
		setFormData(
			isLogin
				? { ...initialRegister }
				: { ...initialLogin, name: "", confirmPassword: "" },
		);
		setFormErrors({});
	}, [isLogin, toggleMode]);

	return (
		<AuthScreen
			mode={mode}
			error={error}
			loading={loading}
			formData={formData}
			formErrors={formErrors}
			onFieldChange={onFieldChange}
			onSubmit={onSubmit}
			onToggleMode={handleToggle}
		/>
	);
}
