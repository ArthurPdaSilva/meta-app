import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { ChecklistService } from "./checklist.service";

@Controller("checklist")
@UseGuards(JwtAuthGuard)
export class ChecklistController {
	constructor(private readonly checklistService: ChecklistService) {}

	@Get()
	async findByDay(
		@Req() req: { user: { id: number } },
		@Query("day") day: string,
	) {
		return this.checklistService.findByDay(req.user.id, day);
	}

	@Post()
	async addItem(
		@Req() req: { user: { id: number } },
		@Body() body: { title: string; goalId?: number },
	) {
		return this.checklistService.addItem(
			req.user.id,
			new Date().toISOString().split("T")[0],
			body.title,
			body.goalId,
		);
	}

	@Patch(":id")
	async toggleItem(
		@Req() req: { user: { id: number } },
		@Param("id", ParseIntPipe) id: number,
	) {
		return this.checklistService.toggleItem(id, req.user.id);
	}

	@Delete(":id")
	async removeItem(
		@Req() req: { user: { id: number } },
		@Param("id", ParseIntPipe) id: number,
	) {
		await this.checklistService.removeItem(id, req.user.id);
	}

	@Post("advance-day")
	async advanceDay(@Req() req: { user: { id: number } }) {
		return this.checklistService.advanceDay(req.user.id);
	}
}
