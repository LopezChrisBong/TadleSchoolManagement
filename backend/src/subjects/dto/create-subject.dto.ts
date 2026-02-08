import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  subject_title: string;

  @ApiProperty()
  seniorJunior: string;

  @ApiProperty()
  semester: string;

  @ApiProperty()
  senior_level: string;

  @ApiProperty()
  indicator: string;

  @ApiProperty()
  sub_subject: string;

  @ApiProperty()
  grade_level: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  writen_works: number;

  @ApiProperty()
  performance_task: number;

  @ApiProperty()
  quarter_assessment: number;

  @ApiProperty()
  date_from: string;

  @ApiProperty()
  date_to: string;

  @ApiProperty()
  school_yearId: number;

  @ApiProperty()
  isSpecialized: number;

  @ApiProperty()
  strandID: number;
}
