import { IssueModel, IssueStatus } from '@models/issue.model';
import { RepositoryModel } from '@models/repository.model';
import { IssueFiltersDto } from '@modules/issues/issue.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectModel(RepositoryModel.name)
    private readonly repoModel: Model<RepositoryModel>,
    @InjectModel(IssueModel.name)
    private readonly issueModel: Model<IssueModel>,
  ) {}

  // Repository methods
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

  // Issue methods
  async createIssue(data: Partial<IssueModel>): Promise<IssueModel> {
    return this.issueModel.create(data);
  }

  async findIssueById(id: string): Promise<IssueModel | null> {
    return this.issueModel
      .findById(id)
      .populate('createdBy assignedTo repoId')
      .exec();
  }

  async getIssuesByRepository(
    repoId: string,
    filters: IssueFiltersDto,
  ): Promise<IssueModel[]> {
    const query: any = { repoId: new Types.ObjectId(repoId) };

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.assignedTo) {
      query.assignedTo = new Types.ObjectId(filters.assignedTo);
    }

    if (filters.createdBy) {
      query.createdBy = new Types.ObjectId(filters.createdBy);
    }

    if (filters.labels) {
      const labelArray = filters.labels.split(',').map((label) => label.trim());
      query.labels = { $in: labelArray };
    }

    return this.issueModel
      .find(query)
      .populate('createdBy assignedTo repoId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateIssueStatus(
    issueId: string,
    status: IssueStatus,
  ): Promise<IssueModel | null> {
    return this.issueModel
      .findByIdAndUpdate(issueId, { status }, { new: true })
      .populate('createdBy assignedTo repoId')
      .exec();
  }

  async updateIssue(
    issueId: string,
    data: Partial<IssueModel>,
  ): Promise<IssueModel | null> {
    return this.issueModel
      .findByIdAndUpdate(issueId, data, { new: true })
      .populate('createdBy assignedTo repoId')
      .exec();
  }

  async deleteIssue(issueId: string): Promise<boolean> {
    const result = await this.issueModel.findByIdAndDelete(issueId).exec();
    return !!result;
  }

  async getIssuesByUser(userId: string): Promise<IssueModel[]> {
    return this.issueModel
      .find({
        $or: [
          { createdBy: new Types.ObjectId(userId) },
          { assignedTo: new Types.ObjectId(userId) },
        ],
      })
      .populate('createdBy assignedTo repoId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
