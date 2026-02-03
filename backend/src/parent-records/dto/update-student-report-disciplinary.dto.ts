import { PartialType } from '@nestjs/swagger';
import { CreateStudentReportDisciplinaryDto } from './create-student-report-disciplinary.dto';

export class UpdateStudentReportDiscipilinarydDto extends PartialType(
  CreateStudentReportDisciplinaryDto,
) {}
