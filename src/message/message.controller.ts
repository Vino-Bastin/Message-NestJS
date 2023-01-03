import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Request,
  Param,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { Public } from 'src/Common/decorator';
import {
  MessageIdDto,
  NewMessageDto,
  UpdatedMessageDto,
} from 'src/DTO/message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //* get all message - /message
  @Public() //* marking this route as public route
  @Get()
  async getAllMessages() {
    return {
      status: 'success',
      data: await this.messageService.getAllMessages(),
    };
  }

  //* create a new message - /message
  @Post()
  async createNewMessage(@Body() message: NewMessageDto, @Request() req) {
    return {
      status: 'success',
      data: await this.messageService.createNewMessage({
        ...message,
        createdBy: req.user.sub,
      }),
    };
  }

  //* get a message - /message/messageId
  @Public() //* making this route as public
  @Get('/:messageId')
  async getAMessage(@Param() params: MessageIdDto) {
    const message = await this.messageService.getAMessage(params.messageId);

    if (!message)
      throw new BadRequestException({
        message: 'No Message Found with the given message id',
      });

    return {
      status: 'success',
      data: message,
    };
  }

  //* update a message - /message/messageId
  @Patch('/:messageId')
  async updateAMessage(
    @Param() params: MessageIdDto,
    @Body() updateMessage: UpdatedMessageDto,
  ) {
    return this.messageService.updateAMessage(params.messageId, updateMessage);
  }
}
