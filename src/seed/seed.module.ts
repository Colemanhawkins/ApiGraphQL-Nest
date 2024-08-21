import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ItemsModule, UsersModule, ConfigModule],
})
export class SeedModule {}
