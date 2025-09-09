import { ApiProperty } from "@nestjs/swagger"

export class CreateAddStrandDto {

    @ApiProperty()
    strand_name: string;

    @ApiProperty()
    trackId:string;
}
