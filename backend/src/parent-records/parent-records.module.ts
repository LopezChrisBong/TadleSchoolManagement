import { Module } from '@nestjs/common';
import { ParentRecordsService } from './parent-records.service';
import { ParentRecordsController } from './parent-records.controller';
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
import { ParentRecord } from './entities/parent-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParentRecord,
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
  controllers: [ParentRecordsController],
  providers: [ParentRecordsService],
})
export class ParentRecordsModule {}
