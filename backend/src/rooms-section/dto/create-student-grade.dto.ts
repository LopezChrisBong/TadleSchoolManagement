import { ApiProperty } from "@nestjs/swagger"

export class CreateStudentGradeDto {

    @ApiProperty()
    roomID: number;

    @ApiProperty()
    school_yearID:number;
    
    @ApiProperty()
    sub_subject:number;

     @ApiProperty()
    quarterScore:number;

     @ApiProperty()
    studentID:number;

     @ApiProperty()
    subjectID:number;

    @ApiProperty()
    highest_posible_score:number;

    @ApiProperty()
    type:number;

    @ApiProperty()
    quarter:string;

    @ApiProperty()
    semester:string;

    @ApiProperty()
    data:string;
}
