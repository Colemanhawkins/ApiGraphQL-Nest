import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { description: 'Creacion de un item.' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], {
    name: 'items',
    description: 'Busca todos los items en base al Id de un usuario.',
  })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, {
    name: 'item',
    description: 'Busca un item en base a su Id.',
  })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item, { description: 'Actualiza un item.' })
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item, { description: 'Remueve un item.' })
  async removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
