import { RepositoryModel } from '@models/repository.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectModel(RepositoryModel.name)
    private readonly repoModel: Model<RepositoryModel>,
  ) {}

  async createRepository(
    data: Partial<RepositoryModel>,
  ): Promise<RepositoryModel> {
    return this.repoModel.create(data);
  }

  async findById(id: string): Promise<RepositoryModel | null> {
    return this.repoModel.findById(id).populate('owner collaborators').exec();
  }

  async findByNameAndOwner(
    name: string,
    ownerId: string,
  ): Promise<RepositoryModel | null> {
    return this.repoModel
      .findOne({ name, owner: new Types.ObjectId(ownerId) })
      .exec();
  }

  async updateRepository(
    id: string,
    data: Partial<RepositoryModel>,
  ): Promise<RepositoryModel | null> {
    return this.repoModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('owner collaborators')
      .exec();
  }

  async deleteRepository(id: string): Promise<boolean> {
    const result = await this.repoModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async addCollaborator(
    repoId: string,
    userId: string,
  ): Promise<RepositoryModel | null> {
    return this.repoModel
      .findByIdAndUpdate(
        repoId,
        { $addToSet: { collaborators: new Types.ObjectId(userId) } },
        { new: true },
      )
      .populate('owner collaborators')
      .exec();
  }

  async removeCollaborator(
    repoId: string,
    userId: string,
  ): Promise<RepositoryModel | null> {
    return this.repoModel
      .findByIdAndUpdate(
        repoId,
        { $pull: { collaborators: new Types.ObjectId(userId) } },
        { new: true },
      )
      .populate('owner collaborators')
      .exec();
  }

  async getRepositoriesByOwner(ownerId: string): Promise<RepositoryModel[]> {
    return this.repoModel
      .find({ owner: ownerId })
      .populate('owner collaborators')
      .exec();
  }

  async getRepositoriesByUser(userId: string): Promise<RepositoryModel[]> {
    return this.repoModel
      .find({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { collaborators: new Types.ObjectId(userId) },
        ],
      })
      .populate('owner collaborators')
      .exec();
  }

  async getRepositoriesByCollaborator(
    collaboratorId: string,
  ): Promise<RepositoryModel[]> {
    return this.repoModel
      .find({ collaborators: new Types.ObjectId(collaboratorId) })
      .populate('owner collaborators')
      .exec();
  }
}
