import { PartialType } from '@nestjs/swagger';
import { CreateAddStrandDto } from './create-add-strand.dto';

export class UpdateAddStrandDto extends PartialType(CreateAddStrandDto) {}
