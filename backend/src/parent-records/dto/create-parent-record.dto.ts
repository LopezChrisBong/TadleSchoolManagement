import { ApiProperty } from '@nestjs/swagger';

export class CreateParentRecordDto {
  @ApiProperty()
  studentID: number;

  @ApiProperty()
  parentID: number;

  @ApiProperty()
  school_yearID: number;

  @ApiProperty()
  teacherID: number;

  @ApiProperty()
  semester: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  schedule: string;

  @ApiProperty()
  purpose: string;
}
