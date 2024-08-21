import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, {
    name: 'executeSeed',
    description:
      'Inyecta en la base de datos y las tablas con registros(previamente limpia todo registro).',
  })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
