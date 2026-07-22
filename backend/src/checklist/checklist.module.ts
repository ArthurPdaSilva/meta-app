import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { ChecklistController } from "./checklist.controller";
import { ChecklistService } from "./checklist.service";

@Module({
	imports: [UsersModule],
	controllers: [ChecklistController],
	providers: [ChecklistService],
})
export class ChecklistModule {}
