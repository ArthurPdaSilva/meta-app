import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Patch,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Patch("profile")
	@HttpCode(HttpStatus.OK)
	async updateProfile(
		@Req() req: { user: { id: number } },
		@Body() body: { name: string },
	) {
		const user = await this.usersService.updateName(req.user.id, body.name);
		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}
		return { id: user.id, email: user.email, name: user.name };
	}
}
