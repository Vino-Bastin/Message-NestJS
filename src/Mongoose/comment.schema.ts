import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from './user.schema';

//* Mongoose comment schema
@Schema()
export class Comment {
  @Prop({ required: true })
  comment: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  createdBy: User;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ default: false })
  isReply: boolean;

  @Prop({ ref: 'Comment', type: [{ type: Types.ObjectId }] })
  replies: Comment[];
}

//* typescript type for mongoose comment schema
export type CommentDocument = HydratedDocument<Comment>;

//* mongoose comment model based on message schema
export const CommentSchema = SchemaFactory.createForClass(Comment);
