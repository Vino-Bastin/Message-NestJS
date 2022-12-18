import { Injectable } from '@nestjs/common';

import { User } from 'src/user/schema/user.schema';
import { UserRepository } from 'src/user/user.repository';
import { NewUserDto } from 'src/user/userDto/user.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  createNewUser(user: NewUserDto): Promise<User> {
    const newUserDetails: User = {
      ...user,
      createdAt: new Date(),
      isActive: true,
      passwordChangedAt: new Date(),
    };
    return this.userRepository.create(newUserDetails);
  }
}
