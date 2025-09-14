import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'repositories', timestamps: true })
export class RepositoryModel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'UserModel', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserModel' }], default: [] })
  collaborators: Types.ObjectId[];
}

export const RepositorySchema = SchemaFactory.createForClass(RepositoryModel);
