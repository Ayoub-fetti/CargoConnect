import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsString()
  cargoType: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  departureDate: string;

  @IsString()
  @IsOptional()
  estimatedDuration?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredLicenses?: string[];
}
