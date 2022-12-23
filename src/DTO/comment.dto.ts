import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsValidMongoDBId } from 'src/Common/Validation';

export class NewCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class ReplyCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsValidMongoDBId({
    message: 'invalid origin comment id',
  })
  originComment: Types.ObjectId;
}

export interface NewComment {
  comment: string;
  createdBy: Types.ObjectId;
}

export interface ReplyComment {
  comment: string;
  createdBy: Types.ObjectId;
  originComment: Types.ObjectId;
}
