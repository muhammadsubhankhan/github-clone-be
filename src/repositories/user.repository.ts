import { IPaginatedModelResponse } from '@interfaces/paginatedModelResponse.interface';
import { IPaginationDBParams } from '@interfaces/paginationDBParams.interface';
import { UserModel } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserModel> {
  constructor(@InjectModel(UserModel.name) userModel: Model<UserModel>) {
    super(userModel);
  }

  public async getUsers(
    params: IPaginationDBParams,
  ): Promise<IPaginatedModelResponse<UserModel>> {
    return this.findAll({}, params);
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return this.findOne({ email });
  }

  public async findByPasswordToken(token: string): Promise<UserModel | null> {
    return this.findOne({ passwordToken: token });
  }
}
