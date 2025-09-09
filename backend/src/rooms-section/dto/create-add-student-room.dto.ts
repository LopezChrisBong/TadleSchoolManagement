import { ApiProperty } from "@nestjs/swagger"

export class CreateAddStudentRoomDto {
    @ApiProperty()
    classID:string

    @ApiProperty()
    stundent_list:string

    @ApiProperty()
    removed_student:string
}