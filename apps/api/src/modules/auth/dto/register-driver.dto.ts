import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
} from 'class-validator';

export class RegisterDriverDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsOptional()
  licenseTypes?: string[];

  @IsArray()
  @IsOptional()
  zone?: string[];
}
