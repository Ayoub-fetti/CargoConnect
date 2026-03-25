import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MissionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Mission extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  cargoType: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  departureDate: Date;

  @Prop()
  estimatedDuration?: string;

  @Prop({ type: String, enum: MissionStatus, default: MissionStatus.OPEN })
  status: MissionStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedDriverId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  requiredLicenses: string[];
}

export const MissionSchema = SchemaFactory.createForClass(Mission);
