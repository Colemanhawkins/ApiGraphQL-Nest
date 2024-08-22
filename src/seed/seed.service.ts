import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly itemService: ItemsService,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly listService: ListsService,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly listItemService: ListItemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run seed on production');
    }
    //limpiar la DB
    await this.deleteDatabase();

    //crear usuarios
    const user = await this.loadUser();

    //crear items
    await this.loadItems(user);

    //crea listas
    const list = await this.loadLists(user);

    const items = await this.itemService.findAll(
      user,
      {
        limit: 15,
        offset: 0,
      },
      {},
    );

    await this.loadListItems(list, items);

    return true;
  }

  async deleteDatabase() {
    // borrar items
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  async loadUser(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const listsPromises = [];

    for (const list of SEED_LISTS) {
      listsPromises.push(this.listService.create(list, user));
    }

    await Promise.all(listsPromises);

    return listsPromises[0];
  }

  async loadListItems(list: List, items: Item[]) {
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
