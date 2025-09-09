import { ApiProperty } from "@nestjs/swagger"

export class CreateLardoStudentNotificationDto {

    @ApiProperty()
    studentID:number

    @ApiProperty()
    student_name: string;

    @ApiProperty()
    teacherID:number;

    @ApiProperty()
    school_yearID:number;

    @ApiProperty()
    route:string

    @ApiProperty()
    remarks:string

    @ApiProperty()
    grade_level:string

    @ApiProperty()
    room_name:string

    @ApiProperty()
    subject_title:string

    @ApiProperty()
    read:boolean

}
