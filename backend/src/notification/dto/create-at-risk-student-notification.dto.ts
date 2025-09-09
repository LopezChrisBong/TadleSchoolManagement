import { ApiProperty } from "@nestjs/swagger"

export class CreateAtRiskStudentNotificationDto {

    @ApiProperty()
    studentID:number

    @ApiProperty()
    student_name: string;

    @ApiProperty()
    teacherID:number;

    @ApiProperty()
    school_yearID:number;

    @ApiProperty()
    transmuted_grade:number

    @ApiProperty()
    route:string

    @ApiProperty()
    remarks:string

    @ApiProperty()
    room_name:string

    @ApiProperty()
    grade_level:string

    @ApiProperty()
    subject_title:string

    @ApiProperty()
    read:boolean

}
