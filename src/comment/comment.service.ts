import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewComment, ReplyComment } from 'src/DTO/comment.dto';
import { Comment, CommentDocument } from 'src/Mongoose/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  //* get all comment and reply comments for a message
  async getComments(messageId: Types.ObjectId): Promise<Comment[] | undefined> {
    return this.commentModel
      .find({ messageId: messageId })
      .select('-messageId') //* deselecting messageId in comments document in db
      .populate('replies') //* populating all the replies
      .populate({
        //* populating all the replies user id
        path: 'replies',
        populate: {
          path: 'createdBy',
          model: 'User',
          select: ['userName'],
        },
      })
      .populate({ path: 'createdBy', select: ['userName'] }); //* populating the userName for comment
  }

  //* create a new comment for a message
  async createAComment(
    messageId: Types.ObjectId,
    comment: NewComment,
  ): Promise<Comment> {
    //* creating a new comment
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
