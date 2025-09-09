import { PartialType } from '@nestjs/swagger';
import { CreateRoomsSectionDto } from './create-rooms-section.dto';

export class UpdateRoomsSectionDto extends PartialType(CreateRoomsSectionDto) {}
