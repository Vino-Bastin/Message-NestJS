// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//* mongoose user schema
@Schema()
export class User {
  @Prop({ required: [true, 'Please Provide first Name.'] })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: [true, 'Please Provide User Name.'], unique: true })
  userName: string;

  @Prop({
    required: true,
    minlength: [8, 'Password Must have 8 or more Characters.'],
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    validate: {
      //* custom validator to check password and confirmPassword are same or not
      validator: function (confirmPassword: string): boolean {
        return this.password === confirmPassword;
      },
      message: 'password and confirmPassword must be same.',
    },
  })
  confirmPassword: string;

  @Prop({ default: true, select: false })
  isActive: boolean;

  @Prop({ default: Date.now(), select: false })
  createdAt: Date;

  @Prop({ default: Date.now(), select: false })
  passwordChangedAt: Date;
}

//* typescript type for mongoose user schema
export type UserDocument = User & Document;

//* mongoose user model based on user schema
export const UserSchema = SchemaFactory.createForClass(User);

//* mongoose user pre - save middleware
UserSchema.pre('save', function (next) {
  //* check if password is modified
  if (this.isModified('password')) {
    //* generate hash for password
    this.password = bcrypt.hashSync(this.password, 10);

    //* prevent confirmPassword to be saved on database
    this.confirmPassword = undefined;
  }

  //* calling next middleware in middleware stack
  return next();
});

//* mongoose user schema global methods
UserSchema.methods.isValidPassword = async function (
  password,
): Promise<boolean> {
  //* check if the given password is correct or not
  return bcrypt.compare(this.password, password);
};
