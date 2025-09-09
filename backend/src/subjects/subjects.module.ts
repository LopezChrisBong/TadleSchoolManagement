import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { GradeLevel, Subject, TeacherGradeLevel } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherSubject } from './entities/prefered-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject,TeacherSubject,TeacherGradeLevel,GradeLevel])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
