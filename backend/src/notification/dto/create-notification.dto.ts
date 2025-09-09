import { ApiProperty } from "@nestjs/swagger"

export class CreateNotificationDto {

    @ApiProperty()
    studentID:number

    @ApiProperty()
    student_name: string;

    @ApiProperty()
    parentID:number;

    @ApiProperty()
    school_yearID:number;

    @ApiProperty()
    transmuted_grade:number

    @ApiProperty()
    route:boolean

    @ApiProperty()
    remarks:string

     @ApiProperty()
    read:boolean

}
