import { Module } from '@nestjs/common';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [PartnersModule, ProjectsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
