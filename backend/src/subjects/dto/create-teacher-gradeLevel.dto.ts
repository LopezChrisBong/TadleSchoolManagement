import { ApiProperty } from "@nestjs/swagger"

export class CreateTeacherGradeLevelDto {

    @ApiProperty()
    userID: string;

    @ApiProperty()
    gradeLevel_list:string;

    @ApiProperty()
    removed_gradeLevel:string;


}
