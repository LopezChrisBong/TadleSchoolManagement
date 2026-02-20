import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentReportDisciplinaryDto {
  @ApiProperty()
  studentID: number;

  @ApiProperty()
  teacherID: number;

  @ApiProperty()
  roomID: number;

  @ApiProperty()
  report_type: number;

  @ApiProperty()
  school_yearID: number;

  @ApiProperty()
  subjectID: number;

  @ApiProperty()
  report_description: string;

  @ApiProperty()
  grade_level: string;

  @ApiProperty()
  tag_students: string;

  @ApiProperty()
  status: number;
}
