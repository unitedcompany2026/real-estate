import { Module } from '@nestjs/common';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [PartnersModule, ProjectsModule, PrismaModule, ApartmentsModule, PropertiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
