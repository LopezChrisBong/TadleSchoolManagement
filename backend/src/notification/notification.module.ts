import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddStrand, AddTracks, Availability, ParentRecord, RoomsSection, StudentAttendance, StudentGrade, StudentList, StudentQuarterFinalGrade, TransmutedGrade } from 'src/entities';

@Module({
   imports: [TypeOrmModule.forFeature([ParentRecord,RoomsSection, AddTracks,AddStrand, StudentList,Availability,StudentAttendance, StudentGrade, TransmutedGrade, StudentQuarterFinalGrade])],  
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
