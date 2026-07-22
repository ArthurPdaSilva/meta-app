import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email é obrigatório")
		.email("Digite um email válido"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z
	.object({
		name: z.string().min(1, "Nome é obrigatório"),
		email: z
			.string()
			.min(1, "Email é obrigatório")
			.email("Digite um email válido"),
		password: z
			.string()
			.min(1, "Senha é obrigatória")
			.min(6, "Senha deve ter no mínimo 6 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Senhas não conferem",
		path: ["confirmPassword"],
	});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
