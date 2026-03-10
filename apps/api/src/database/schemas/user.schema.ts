import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  COMPANY = 'COMPANY',
}

@Schema({ timestamps: true, discriminatorKey: 'role' })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationExpires?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ select: false })
  refreshToken?: string;

  @Prop()
  refreshTokenExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class Driver {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  avatar?: string;

  @Prop({ type: [String], default: [] })
  licenseTypes: string[];

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String], default: [] })
  zone: string[];
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

@Schema()
export class Company {
  @Prop({ required: true })
  companyName: string;

  @Prop()
  legalInfo?: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop()
  logo?: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
