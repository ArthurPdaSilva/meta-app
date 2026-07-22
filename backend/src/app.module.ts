import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ChecklistModule } from "./checklist/checklist.module";
import { GoalsModule } from "./goals/goals.module";
import { HealthController } from "./health.controller";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [AuthModule, UsersModule, GoalsModule, ChecklistModule],
	controllers: [HealthController],
})
export class AppModule {}
