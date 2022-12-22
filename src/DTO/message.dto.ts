import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsValidMongoDBId } from 'src/Common/Validation';

export class NewMessageDto {
  @IsValidMongoDBId({
    message: 'Invalid message creator id',
  })
  createdBy: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdatedMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  message?: string;

  @Min(1)
  @IsNumber()
  @IsOptional()
  thumbsUp?: boolean;

  @Min(1)
  @IsNumber()
  @IsOptional()
  hear?: boolean;

  @Min(1)
  @IsNumber()
  @IsOptional()
  laughs?: boolean;

  @Min(1)
  @IsNumber()
  @IsOptional()
  angry?: boolean;

  @Min(1)
  @IsNumber()
  @IsOptional()
  sad?: boolean;
}

export class MessageIdDto {
  @IsValidMongoDBId({
    message: 'Invalid message id',
  })
  messageId: Types.ObjectId;
}
