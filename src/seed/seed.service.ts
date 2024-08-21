import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

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

    return true;
  }

  async deleteDatabase() {
    // borrar items
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
}
