import { PartialType } from '@nestjs/swagger';
import { CreateStudentListDto } from './create-student-list.dto';

export class UpdateStudentListDto extends PartialType(CreateStudentListDto) {}
