import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  fname: string;

  @ApiProperty()
  mname: string;

  @ApiProperty()
  @IsNotEmpty()
  lname: string;

  @ApiProperty()
  suffix: string;

  @ApiProperty()
  user_roleID: number;

  @ApiProperty()
  positionID: string;

  @ApiProperty()
  assignedModuleID: number;

  @ApiProperty()
  instituteID: string;

  @ApiProperty()
  empStatusID: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  isValidated: boolean;

  @ApiProperty()
  subModules: string;

  @ApiProperty()
  officeID: string;

  @ApiProperty()
  designationID: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
