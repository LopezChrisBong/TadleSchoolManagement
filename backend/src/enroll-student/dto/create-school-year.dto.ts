import { ApiProperty } from "@nestjs/swagger"

export class CreateSchoolYearDto {

    @ApiProperty()
    school_year_from: string;

    @ApiProperty()
    school_year_to: string;

    @ApiProperty()
    status: boolean;
}