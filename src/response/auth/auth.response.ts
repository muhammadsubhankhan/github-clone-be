import { UserModel } from '@/models/user.model';

export interface LoginResponse {
  user: UserModel;
  accessToken: string;
}
