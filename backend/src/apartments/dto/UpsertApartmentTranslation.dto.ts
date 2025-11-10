import { ApiProperty } from "@nestjs/swagger";

export class UpsertApartmentTranslationDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  description: string;
}
