import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: [true, 'Please Provide firstName'] })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: [true, 'Please Provide UserName'], unique: true })
  userName: string;

  @Prop({
    required: true,
    minlength: [8, 'Password Must have 8 or more Characters'],
    select: false,
  })
  password: string;

  @Prop({ default: true, select: false })
  isActive: boolean;

  @Prop({ default: Date.now(), select: false })
  createdAt: Date;

  @Prop({ default: Date.now(), select: false })
  passwordChangedAt: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
