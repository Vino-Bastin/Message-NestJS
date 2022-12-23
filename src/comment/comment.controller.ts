import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { NewCommentDto, ReplyCommentDto } from 'src/DTO/comment.dto';
import { MessageIdDto } from 'src/DTO/message.dto';
import { CommentService } from './comment.service';

@Controller('/message/:messageId')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //* get comments for a message
  @Get('/comment')
  async getComments(@Param() params: MessageIdDto) {
    return {
      status: 'success',
      data: await this.commentService.getComments(params.messageId),
    };
  }

  //* created a comment for a message
  @Post('/comment')
  async createAComment(
    @Param() params: MessageIdDto,
    @Body() comment: NewCommentDto,
    @Request() req,
  ) {
    return {
      status: 'success',
      data: await this.commentService.createAComment(params.messageId, {
        ...comment,
        createdBy: req.user.sub,
      }),
    };
  }

  //* create a reply comment for comment in message
  @Post('reply')
  async createReplyComment(
    @Param() params: MessageIdDto,
    @Body() replyComment: ReplyCommentDto,
    @Request() req,
  ) {
    return {
      status: 'success',
      data: await this.commentService.createReplyComment(params.messageId, {
        ...replyComment,
        createdBy: req.user.sub,
      }),
    };
  }
}
