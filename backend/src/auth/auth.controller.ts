import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(
		@Body() body: { email: string; password: string; name: string },
	) {
		return this.authService.register(body.email, body.password, body.name);
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(@Body() body: { email: string; password: string }) {
		return this.authService.login(body.email, body.password);
	}
}
