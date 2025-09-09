import { ApiProperty } from "@nestjs/swagger"

export class CreateStudentQuarterFinalGradeDto {

    @ApiProperty()
    roomID: number;

    @ApiProperty()
    school_yearID:number;

     @ApiProperty()
    initial_grade:string;

     @ApiProperty()
    studentID:number;

    @ApiProperty()
    teacherID:number;

    @ApiProperty()
    sub_subject:string;
    

     @ApiProperty()
    subjectID:number;

    @ApiProperty()
    transmuted_grade:number;

    @ApiProperty()
    studentLRN:string;

    @ApiProperty()
    quarter:string;

    @ApiProperty()
    semester:string;

    @ApiProperty()
    data:string;
}
