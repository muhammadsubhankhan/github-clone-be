import { Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export abstract class BaseModel extends Document {
  _id: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}
