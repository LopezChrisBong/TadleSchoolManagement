import { ApiProperty } from "@nestjs/swagger"

export class CreateTransmutedGradeDto {

    @ApiProperty()
    start_range: string;
    
    @ApiProperty()
    end_range: string;

    @ApiProperty()
    transmuted_grade: number;
}
