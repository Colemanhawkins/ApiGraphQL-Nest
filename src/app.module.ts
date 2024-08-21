import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //configuracion basica
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    //asincrono para tener el modulo de jwt para validar y mostrar schema en base a la autenticacion
    // igual esta mal implementado ya que la mismisa query que solicita el playground no puede tener los jwt , por alguna razon faltan cabeceras
    // y existe un problema de operaciones no vacias de query o persistencia de queries
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async (jwtService: JwtService) => ({
    //     playground: false,
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     plugins: [ApolloServerPluginLandingPageLocalDefault],
    //     csrfPrevention: false,
    //     context({ req }) {
    //       const token = req.headers.authorization?.replace('Bearer ', '');
    //       console.log(req.headers);
    //       if (!token) throw Error('Token needed');
    //       const payload = jwtService.decode(token);
    //       if (!payload) throw Error('Token not valid');
    //     },
    //   }),
    // }),

    ItemsModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //para crear tablas
      synchronize: true,
      autoLoadEntities: true,
    }),

    UsersModule,

    AuthModule,

    SeedModule,

    CommonModule,

    ListsModule,

    ListItemModule,
  ],
})
export class AppModule {}
