import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateListInput, UpdateListInput } from './dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List, {
    description: 'Crea una lista.',
  })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], {
    name: 'lists',
    description:
      'Obtienes todas las listas en relacion a un usuario. 2 parametro: offset y limit . 3 parametro: nombre/string de la lista.',
  })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, search);
  }

  @Query(() => List, {
    name: 'list',
    description: 'Busca una lista por el Id.',
  })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listService.findOne(id, user);
  }

  @Mutation(() => List, { description: 'Actualiza una lista.' })
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { description: 'Remueve una lista.' })
  async removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listService.remove(id, user);
  }

  @ResolveField(() => [ListItem], {
    description:
      'Obtienes todos las lista de items en relacion al Id de una lista.',
  })
  async gestListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return this.listItemsService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Number, {
    name: 'totalItems',
    description:
      'Obtienes la cantidad de listas de items en relacion a una lista.',
  })
  async countListItemsByList(@Parent() list: List): Promise<number> {
    return this.listItemsService.countListItemsByList(list);
  }
}
