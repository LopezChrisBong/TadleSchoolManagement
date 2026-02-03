import { PartialType } from '@nestjs/swagger';
import { CreateTransmutedGradeDto } from './create-transmuted-grade.dto';

export class UpdateTransmutedGradeDto extends PartialType(
  CreateTransmutedGradeDto,
) {}
