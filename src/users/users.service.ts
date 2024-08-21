import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SingupInput } from 'src/auth/dto/input/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(singupInput: SingupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...singupInput,
        password: bcrypt.hashSync(singupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {
    if (validRoles.length === 0) return this.usersRepository.find();

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('Array[roles] && ARRAY[:...roles]')
      .setParameter('roles', validRoles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${email} is not found`,
      // });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });
      user.lastUpdateBy = adminUser;
      return await this.usersRepository.save(user);
    } catch (error) {
      return this.handleDBErrors(error);
    }
  }

  async blockUser(id: string, adminUser: User): Promise<User> {
    try {
      const userToBlock = await this.findOneById(id);
      userToBlock.isActive = false;
      userToBlock.lastUpdateBy = adminUser;
      return await this.usersRepository.save(userToBlock);
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }
  //todos los caminos dan una excepcion y no devuelve nada
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    // if(error.code === 'error-001'){
    //   throw new BadRequestException
    // }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
