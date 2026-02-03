import { Module } from '@nestjs/common';
import { SchoolEventsService } from './school-events.service';
import { SchoolEventsController } from './school-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEvent } from 'src/entities';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        SchoolEvent
      ]),
    ],
  controllers: [SchoolEventsController],
  providers: [SchoolEventsService],
})
export class SchoolEventsModule {}
