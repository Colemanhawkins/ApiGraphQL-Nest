import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SingupInput } from './dto/input';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async singUp(singupInput: SingupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(singupInput);

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email/Password not valid');
    }

    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    try {
      const user = await this.usersService.findOneById(id);
      if (!user.isActive) {
        throw new UnauthorizedException(`User is inactive, talk with an admin`);
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return { token, user };
  }
}
