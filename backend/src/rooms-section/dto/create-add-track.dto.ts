import { ApiProperty } from "@nestjs/swagger"

export class CreateAddTrackDto {

    @ApiProperty()
    tracks_name: string;
}
