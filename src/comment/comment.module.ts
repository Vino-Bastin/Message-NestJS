import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/Mongoose/comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Message, MessageSchema } from 'src/Mongoose/message.schema';

@Module({
  imports: [
    //* mongoose comment model injection
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
