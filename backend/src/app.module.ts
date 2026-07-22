import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health.controller";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [AuthModule, UsersModule],
	controllers: [HealthController],
})
export class AppModule {}
