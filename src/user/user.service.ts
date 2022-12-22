import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { NewUserDto } from 'src/DTO/user.dto';
import { User, UserDocument } from 'src/Mongoose/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: NewUserDto): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async fineOneByUserName(
    userName: string,
    select?: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ userName: userName }).select(select);
  }

  async verifyPassword(password, hash): Promise<boolean> {
    return this.userModel.schema.methods.isValidPassword(password, hash);
  }

  async findById(
    userId: Types.ObjectId,
    select?: string,
  ): Promise<UserDocument> {
    return this.userModel.findById(userId).select(select);
  }

  async findByIdAndUpdate(
    userId: Types.ObjectId,
    data: UpdateQuery<User>,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userId, data);
  }
}
