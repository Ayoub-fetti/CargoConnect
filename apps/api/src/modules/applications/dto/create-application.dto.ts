import { IsString, IsMongoId, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsMongoId()
  missionId: string;

  @IsString()
  @MinLength(10)
  message: string;
}
