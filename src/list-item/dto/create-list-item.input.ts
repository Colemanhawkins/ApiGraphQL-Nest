import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;
  @Field(() => Boolean, { nullable: false })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
  @Field(() => ID)
  @IsUUID()
  listId: string;
  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
