import { Types } from 'mongoose';

export type JwtPayload = {
  _id: Types.ObjectId;
  email: string | null;
  role: string;
};
