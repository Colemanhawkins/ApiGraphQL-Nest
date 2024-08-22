import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ItemsModule,
    UsersModule,
    ListsModule,
    ListItemModule,
    ConfigModule,
  ],
})
export class SeedModule {}
