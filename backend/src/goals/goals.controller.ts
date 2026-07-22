import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { GoalsService } from "./goals.service";

@Controller("goals")
@UseGuards(JwtAuthGuard)
export class GoalsController {
	constructor(private readonly goalsService: GoalsService) {}

	@Get()
	async findAll(@Req() req: { user: { id: number } }) {
		return this.goalsService.findAllByUser(req.user.id);
	}

	@Post()
	async create(
		@Req() req: { user: { id: number } },
		@Body() body: { title: string; description?: string },
	) {
		return this.goalsService.create(req.user.id, body.title, body.description);
	}

	@Delete(":id")
	async remove(
		@Req() req: { user: { id: number } },
		@Param("id", ParseIntPipe) id: number,
	) {
		await this.goalsService.delete(id, req.user.id);
	}
}
