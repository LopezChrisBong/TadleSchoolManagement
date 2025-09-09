import { ApiProperty } from "@nestjs/swagger"

export class CreateTeacherSubjectDto {

    @ApiProperty()
    userID: string;

    @ApiProperty()
    subject_list:string;

    @ApiProperty()
    removed_subjects:string;


}
