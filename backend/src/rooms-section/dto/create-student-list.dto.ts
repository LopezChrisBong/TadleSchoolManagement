import { ApiProperty } from "@nestjs/swagger"

export class CreateStudentListDto {

    @ApiProperty()
    studentId: number;

    @ApiProperty()
    roomId:number;

    @ApiProperty()
    grade_level:string;

    @ApiProperty()
    school_yearId:number;

    @ApiProperty()
    strandId:number;
}
