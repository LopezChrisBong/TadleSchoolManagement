import { PartialType } from '@nestjs/swagger';
import { CreateStudentValuesDto } from './create-student-values.dto';

export class UpdateStudentValuesDto extends PartialType(
  CreateStudentValuesDto,
) {}
