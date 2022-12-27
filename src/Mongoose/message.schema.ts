import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from './user.schema';

//* mongoose message Schema
@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  editedAt: Date;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ default: 0 })
  thumbsUp: number; //* 👍

  @Prop({ default: 0 })
  heart: number; //* ❤

  @Prop({ default: 0 })
  laughs: number; //*🤣

  @Prop({ default: 0 })
  angry: number; //* 😡

  @Prop({ default: 0 })
  sad: number; //*😌

  @Prop({ default: 0 })
  comments: number;
}

//* typescript type for mongoose message schema
export type MessageDocument = HydratedDocument<Message>;

//* mongoose comment model based on message schema
export const MessageSchema = SchemaFactory.createForClass(Message);
