import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { MissionStatus } from '../schemas/mission.schema';

export class UpdateMissionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  cargoType?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsDateString()
  @IsOptional()
  departureDate?: string;

  @IsString()
  @IsOptional()
  estimatedDuration?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredLicenses?: string[];

  @IsEnum(MissionStatus)
  @IsOptional()
  status?: MissionStatus;
}
