import { IsString, IsOptional } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsOptional()
  message?: string;
}
