import { Module } from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { EnrollStudentController } from './enroll-student.controller';
import { Availability, EnrollStudent, SchoolYear, StudentValues } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EnrollStudent, Availability, SchoolYear,StudentValues])],
  controllers: [EnrollStudentController],
  providers: [EnrollStudentService]
})
export class EnrollStudentModule {}
