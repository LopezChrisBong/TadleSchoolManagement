import { ApiProperty } from "@nestjs/swagger"

export class CreateRoomsSectionDto {

    @ApiProperty()
    room_section: string;

    @ApiProperty()
    grade_level:string;

    @ApiProperty()
    strandId:number;

    @ApiProperty()
    teacherId:number;
}
