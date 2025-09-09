import { PartialType } from '@nestjs/swagger';
import { CreateParentRecordDto } from './create-parent-record.dto';

export class UpdateParentRecordDto extends PartialType(CreateParentRecordDto) {}
