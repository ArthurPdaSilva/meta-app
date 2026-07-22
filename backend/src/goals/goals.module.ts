import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../auth/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";

@Module({
	imports: [UsersModule, PassportModule],
	controllers: [GoalsController],
	providers: [GoalsService, JwtStrategy],
})
export class GoalsModule {}
