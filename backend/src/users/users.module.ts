import { Module } from "@nestjs/common";
import { DatabaseProvider } from "../database.provider";
import { UsersService } from "./users.service";

@Module({
	providers: [UsersService, DatabaseProvider],
	exports: [UsersService, DatabaseProvider],
})
export class UsersModule {}
