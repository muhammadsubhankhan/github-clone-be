import { UserType } from '@/contracts/enums/usertype.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends BaseModel {
  @Prop({ required: true, unique: true, maxlength: 80 })
  email: string;

  @Prop({ maxlength: 128, select: false })
  @Exclude()
  password: string;

  @Prop({ required: true, maxlength: 80 })
  displayName: string;

  @Prop()
  role: UserType;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
