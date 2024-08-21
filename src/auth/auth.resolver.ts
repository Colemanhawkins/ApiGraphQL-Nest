import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { SingupInput, LoginInput } from './dto/input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {
    name: 'singUp',
    description: 'Crea un usuario y lo logea.',
  })
  async singUp(
    @Args('singupInput') singupInput: SingupInput,
  ): Promise<AuthResponse> {
    return this.authService.singUp(singupInput);
  }

  @Mutation(() => AuthResponse, {
    name: 'login',
    description: 'Login de la aplicacion.',
  })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, {
    name: 'revalidate',
    description: 'Validacion del token sino devuelve uno actualizado.',
  })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser([ValidRoles.admin]) user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
