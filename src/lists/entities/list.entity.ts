import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column()
  @Field(() => String)
  name: string;

  //relacion , index('userId-list-index')
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, {
    lazy: true,
  })
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
