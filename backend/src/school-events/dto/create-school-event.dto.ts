import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolEventDto {
  @ApiProperty()
  eventName: string;

  @ApiProperty()
  eventDate: string;

  @ApiProperty()
  eventDescription: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty()
  schoolYearID: number;

  @ApiProperty()
  data: string;
}