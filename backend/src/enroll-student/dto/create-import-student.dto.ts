import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateImportStudentDto {
  @ApiProperty()
  @IsOptional()
  fname?: string;

  @ApiProperty()
  lname: string;

  @ApiProperty()
  mname: string;

  @ApiProperty()
  suffix: string;

  @ApiProperty()
  bdate: string;

  @ApiProperty()
  sex: string;

  @ApiProperty()
  seniorJunior: string;

  @ApiProperty()
  transfered: boolean;

  @ApiProperty()
  isFilipino: string;

  @ApiProperty()
  mobile_no: string;

  @ApiProperty()
  grade_level: string;

  @ApiProperty()
  lrnNo: string;

  @ApiProperty()
  data: string;
}
