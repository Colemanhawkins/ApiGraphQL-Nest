import { ObjectType, Field } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('listItems')
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Number)
  @Column({ type: 'numeric' })
  quantity: number;
  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List)
  list: List;

  //si hay duplicador hay many
  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item;
}
