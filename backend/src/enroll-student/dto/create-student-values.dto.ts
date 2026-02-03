import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentValuesDto {
  @ApiProperty()
  roomId: number;

  @ApiProperty()
  studentId: number;

  @ApiProperty()
  quarter: string;

  @ApiProperty()
  semester: string;

  @ApiProperty()
  school_yearId: number;

  @ApiProperty()
  md1_values: string;

  @ApiProperty()
  md2_values: string;

  @ApiProperty()
  mt1_values: string;

  @ApiProperty()
  mt2_values: string;

  @ApiProperty()
  mk1_values: string;

  @ApiProperty()
  mb1_values: string;

  @ApiProperty()
  mb2_values: string;
}
