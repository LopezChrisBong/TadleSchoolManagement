import { Module } from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { RoomsSectionController } from './rooms-section.controller';
import {
  AddStrand,
  AddTracks,
  Availability,
  RoomsSection,
  StudentAttendance,
  StudentGrade,
  StudentList,
  StudentQuarterFinalGrade,
  TransmutedGrade,
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomsSection,
      AddTracks,
      AddStrand,
      StudentList,
      Availability,
      StudentAttendance,
      StudentGrade,
      TransmutedGrade,
      StudentQuarterFinalGrade,
    ]),
  ],
  controllers: [RoomsSectionController],
  providers: [RoomsSectionService],
  exports: [RoomsSectionService],
})
export class RoomsSectionModule {}
