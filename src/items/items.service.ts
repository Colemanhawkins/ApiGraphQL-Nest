import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { SearchArgs, PaginationArgs } from 'src/common/dto/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    try {
      const newItem = this.itemRepository.create({
        ...createItemInput,
        user: user,
      });
      return await this.itemRepository.save(newItem);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;
    //Todo

    const queryBuilder = this.itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
    // return await this.itemRepository.find({
    //   //limit
    //   take: limit,
    //   //offset
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id,
    //     },
    //     name: Like(`%${search}%`),
    //   },
    // });
  }

  async findOne(id: string, user: User) {
    try {
      const item = await this.itemRepository.findOneBy({
        id,
        user: {
          id: user.id,
        },
      });
      if (!item) {
        throw new NotFoundException('item not found');
      }

      return item;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    // const item = await this.itemRepository.preload({
    //   ...updateItemInput,
    //   user,
    // });
    const item = await this.itemRepository.preload(updateItemInput);
    if (!item) {
      throw new NotFoundException('item not found');
    }
    return this.itemRepository.save(item);
  }

  async remove(id: string, user: User) {
    const item = await this.itemRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!item) {
      throw new NotFoundException('item not found');
    }
    await this.itemRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
