
import { ApiProperty } from "@nestjs/swagger"

export class CreateParentRecordDto {

    @ApiProperty()
    studentID: number;

    @ApiProperty()
    parentID:number;

     @ApiProperty()
    school_yearID:number;
}
