import { ApiProperty } from "@nestjs/swagger"

export class CreateAvailabilityDto {

    @ApiProperty()
    teacherID: number;

    @ApiProperty()
    subjectId: number;

    @ApiProperty()
    roomId: number;

    @ApiProperty()
    grade_level:string;

    @ApiProperty()
    day:string;

    @ApiProperty()
    times_slot_from:string;

    @ApiProperty()
    times_slot_to:string;

    @ApiProperty()
    hours:string;

    @ApiProperty()
    school_yearId:number;

}