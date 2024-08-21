import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { CreateListInput, UpdateListInput } from './dto';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      const newList = this.listRepository.create({
        ...createListInput,
        user: user,
      });
      return await this.listRepository.save(newList);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
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
  }

  async findOne(id: string, user: User) {
    try {
      const list = await this.listRepository.findOneBy({
        id,
        user: {
          id: user.id,
        },
      });
      if (!list) {
        throw new NotFoundException('list not found');
      }

      return list;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const list = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    if (!list) {
      throw new NotFoundException('item not found');
    }
    return this.listRepository.save(list);
  }

  async remove(id: string, user: User) {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) {
      throw new NotFoundException('list not found');
    }
    await this.listRepository.remove(list);
    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
