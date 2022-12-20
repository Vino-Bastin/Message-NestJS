import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

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

  @Prop({ default: null, select: false })
  refreshToken: string;

  @Prop({ default: true, select: false })
  isActive: boolean;

  @Prop({ default: new Date(), select: false })
  createdAt: Date;

  @Prop({ default: new Date(), select: false })
  passwordChangedAt: Date;
}

//* typescript type for mongoose user schema
export type UserDocument = HydratedDocument<User>;

//* mongoose user model based on user schema
export const UserSchema = SchemaFactory.createForClass(User);

//* mongoose user pre - save middleware
UserSchema.pre('save', function (next) {
  //* check if password is modified
  if (this.isModified('password')) {
    //* generate hash for password
    this.password = bcrypt.hashSync(this.password, 10);
    this.passwordChangedAt = new Date();
  }

  //* calling next middleware in middleware stack
  return next();
});

//* mongoose user schema global methods
UserSchema.methods.isValidPassword = async function (
  password: string,
  hash: string,
): Promise<boolean> {
  //* check if the given password is correct or not

  return bcrypt.compare(password, hash);
};
