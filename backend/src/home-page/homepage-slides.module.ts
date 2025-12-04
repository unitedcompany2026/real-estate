import { Module } from '@nestjs/common';
import { HomepageSlidesController } from './homepage-slides.controller';
import { HomepageSlidesService } from './homepage-slides.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomepageSlidesController],
  providers: [HomepageSlidesService],
  exports: [HomepageSlidesService],
})
export class HomepageSlidesModule {}
