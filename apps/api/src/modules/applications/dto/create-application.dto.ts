import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateApplicationDto {
  @IsMongoId()
  missionId: string;

  @IsString()
  @IsOptional()
  message?: string;
}
