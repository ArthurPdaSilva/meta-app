import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../auth/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { ChecklistController } from "./checklist.controller";
import { ChecklistService } from "./checklist.service";

@Module({
	imports: [UsersModule, PassportModule],
	controllers: [ChecklistController],
	providers: [ChecklistService, JwtStrategy],
})
export class ChecklistModule {}
