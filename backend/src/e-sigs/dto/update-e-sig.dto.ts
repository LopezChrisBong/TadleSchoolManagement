import { PartialType } from '@nestjs/swagger';
import { CreateESigDto } from './create-e-sig.dto';

export class UpdateESigDto extends PartialType(CreateESigDto) {}
