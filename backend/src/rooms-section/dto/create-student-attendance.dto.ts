import { ApiProperty } from "@nestjs/swagger"

export class CreateStudentAttendanceDto {

    @ApiProperty()
    roomID: number;

    @ApiProperty()
    school_yearID:number;

     @ApiProperty()
    attendance:number;

     @ApiProperty()
    studentID:number;

     @ApiProperty()
    subjectID:number;

    @ApiProperty()
    attendanceDate:string;

    @ApiProperty()
    data:string;

    @ApiProperty()
    teacherID:number;
}
