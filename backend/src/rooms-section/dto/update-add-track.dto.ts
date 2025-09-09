import { PartialType } from '@nestjs/swagger';
import { CreateAddTrackDto } from './create-add-track.dto';

export class UpdateAddTrackDto extends PartialType(CreateAddTrackDto) {}
