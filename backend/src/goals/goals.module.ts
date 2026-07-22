import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";

@Module({
	imports: [UsersModule],
	controllers: [GoalsController],
	providers: [GoalsService],
})
export class GoalsModule {}
