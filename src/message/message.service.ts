import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

import { NewMessageDto } from 'src/DTO/message.dto';
import { Message, MessageDocument } from 'src/Mongoose/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  //* get all message
  async getAllMessages(): Promise<Message[]> {
    return this.messageModel.find().populate({ path: 'createdBy' });
  }

  //* get a message
  async getAMessage(messageId: Types.ObjectId): Promise<Message> {
    return this.messageModel
      .findById(messageId)
      .populate({ path: 'createdBy' });
  }

  //* create a new message
  async createNewMessage(message: NewMessageDto): Promise<Message> {
    return this.messageModel.create(message);
  }

  //* update a message
  async updateAMessage(
    messageId: Types.ObjectId,
    updatedMessage: UpdateQuery<Message>,
  ): Promise<Message> {
    if (updatedMessage.message) {
      updatedMessage.isEdited = true;
      updatedMessage.editedAt = new Date();
    }

    return this.messageModel
      .findByIdAndUpdate(messageId, updatedMessage, {
        new: true,
      })
      .populate({ path: 'createdBy' });
  }
}
