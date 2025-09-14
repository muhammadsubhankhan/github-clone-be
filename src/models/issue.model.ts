import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  CLOSED = 'closed',
}

@Schema({ collection: 'issues', timestamps: true })
export class IssueModel extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ 
    type: String, 
    enum: Object.values(IssueStatus), 
    default: IssueStatus.OPEN 
  })
  status: IssueStatus;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: Types.ObjectId, ref: 'UserModel', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserModel' })
  assignedTo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepositoryModel', required: true })
  repoId: Types.ObjectId;
}

export const IssueSchema = SchemaFactory.createForClass(IssueModel);
