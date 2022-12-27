import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewComment, ReplyComment } from 'src/DTO/comment.dto';
import { Comment, CommentDocument } from 'src/Mongoose/comment.schema';
import { Message, MessageDocument } from 'src/Mongoose/message.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  //* get all comment and reply comments for a message
  async getComments(messageId: Types.ObjectId): Promise<Comment[] | undefined> {
    return this.commentModel
      .find({ messageId: messageId })
      .populate('replies') //* populating all the replies
      .populate({
        //* populating all the replies user id
        path: 'replies',
        populate: {
          path: 'createdBy',
          model: 'User',
        },
      })
      .populate({ path: 'createdBy' }); //* populating the userName for comment
  }

  //* create a new comment for a message
  async createAComment(
    messageId: Types.ObjectId,
    comment: NewComment,
  ): Promise<Comment> {
    //* creating a new comment

    const message = await this.messageModel.findById(messageId);

    message.comments++;
    message.save();

    return this.commentModel.create({ ...comment, messageId });
  }

  //* create a reply message for a comment
  async createReplyComment(
    messageId: Types.ObjectId,
    replyComment: ReplyComment,
  ): Promise<Comment> {
    const comment = {
      comment: replyComment.comment,
      isReply: true,
      createdBy: replyComment.createdBy,
    };

    const origin = await this.commentModel.findOne({
      $and: [{ _id: replyComment.originComment }, { messageId: messageId }],
    });

    //* checking if the origin comment is exist to create a reply comment
    if (!origin)
      throw new BadRequestException({
        message:
          'No origin comment found - check messageId and origin comment id',
      });

    const data = await this.commentModel.create(comment);

    //* add reply comment id to the origin comment replies array
    origin.replies.push(data._id);
    origin.save();

    return data;
  }
}
