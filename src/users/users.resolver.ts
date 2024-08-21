import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListsService,
  ) {}

  @Query(() => [User], {
    name: 'users',
    description: 'Permite obtener todos los usuarios',
  })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, {
    name: 'user',
    description: 'Permite obtener un usuario por su Id.',
  })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {
    description:
      'Se bloquea un usuario para que no pueda manipular ni solicitar data.',
  })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.blockUser(id, user);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Actualiza un usuario y lo busca en base a su Id.',
  })
  updateUser(
    @Args('updateUser') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @ResolveField(() => Int, {
    name: 'itemCount',
    description:
      'Este campo permite contar cuantos items en base al Id de un usuario.',
  })
  async itemCount(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], {
    name: 'items',
    description:
      'Este campo permite obtener los items en base al Id de un usuario, se puede limitar , dar un offset y como tercer parametro filtrar por el nombre del item que se busca.',
  })
  async getItemsByUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Parent() user: User,
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, {
    name: 'itemCount',
    description:
      'Este campo permite contar cuantas listas posee un usuario por su Id.',
  })
  async listCount(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.listService.listCountByUser(user);
  }

  @ResolveField(() => [List], {
    name: 'lists',
    description:
      'Este campo permite obtener las listas en relacion al Id del usuario.',
  })
  async getListsByUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Parent() user: User,
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }
}
