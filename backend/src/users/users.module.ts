import { Module } from "@nestjs/common";
import { DatabaseProvider } from "../database.provider";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	controllers: [UsersController],
	providers: [UsersService, DatabaseProvider],
	exports: [UsersService, DatabaseProvider],
})
export class UsersModule {}
