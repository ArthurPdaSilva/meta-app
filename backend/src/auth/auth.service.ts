import {
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
	constructor(
		@Inject(UsersService) private readonly usersService: UsersService,
		@Inject(JwtService) private readonly jwtService: JwtService,
	) {}

	async register(email: string, password: string, name: string) {
		const existing = await this.usersService.findByEmail(email);
		if (existing) {
			throw new ConflictException("Email já cadastrado");
		}
		const hash = await bcrypt.hash(password, 10);
		const user = await this.usersService.create(email, hash, name);
		const token = this.jwtService.sign({ sub: user.id, email: user.email });
		return {
			token,
			user: { id: user.id, email: user.email, name: user.name },
		};
	}

	async login(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) {
			throw new UnauthorizedException("Email ou senha inválidos");
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new UnauthorizedException("Email ou senha inválidos");
		}
		const token = this.jwtService.sign({ sub: user.id, email: user.email });
		return {
			token,
			user: { id: user.id, email: user.email, name: user.name },
		};
	}
}
