import { UserType } from '@/contracts/enums/usertype.enum';
import { JwtPayload } from '@/contracts/types/jwtPayload.type';
import { IssueModel, IssueStatus } from '@models/issue.model';
import { RepositoryModel } from '@models/repository.model';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryRepository } from '@repositories/repository.repository';
import { Types } from 'mongoose';
import {
  CreateIssueDto,
  IssueFiltersDto,
  UpdateIssueDto,
  UpdateIssueStatusDto,
} from '../issues/issue.dto';
import {
  AddCollaboratorDto,
  CreateRepositoryDto,
  UpdateRepositoryDto,
} from './repository.dto';

@Injectable()
export class RepositoryService {
  constructor(private readonly repositoryRepository: RepositoryRepository) {}

  async create(
    body: CreateRepositoryDto,
    user: JwtPayload,
  ): Promise<RepositoryModel> {
    // Check if user has permission to create repository
    if (user.role !== UserType.OWNER && user.role !== UserType.COLLABORATOR) {
      throw new ForbiddenException(
        'You do not have permission to create repositories',
      );
    }

    // Check if repository with same name already exists for this user
    const existingRepo = await this.repositoryRepository.findByNameAndOwner(
      body.name,
      user._id.toString(),
    );

    if (existingRepo) {
      throw new BadRequestException('Repository with this name already exists');
    }

    const repositoryData = {
      name: body.name,
      description: body.description || '',
      owner: new Types.ObjectId(user._id),
      collaborators: [] as Types.ObjectId[],
    };

    return this.repositoryRepository.createRepository(repositoryData);
  }

  async getById(id: string, user: JwtPayload): Promise<RepositoryModel> {
    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    return repository;
  }

  async update(
    id: string,
    body: UpdateRepositoryDto,
    user: JwtPayload,
  ): Promise<RepositoryModel> {
    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user is owner or collaborator
    await this.checkRepositoryAccess(repository, user);

    // Only owner can update repository details
    if (repository.owner.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Only the repository owner can update repository details',
      );
    }

    return this.repositoryRepository.updateRepository(id, body);
  }

  async delete(id: string, user: JwtPayload): Promise<boolean> {
    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Only owner can delete repository
    if (repository.owner.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Only the repository owner can delete the repository',
      );
    }

    return this.repositoryRepository.deleteRepository(id);
  }

  async addCollaborator(
    id: string,
    body: AddCollaboratorDto,
    user: JwtPayload,
  ): Promise<RepositoryModel> {
    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Only owner can add collaborators
    if (repository.owner.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Only the repository owner can add collaborators',
      );
    }

    // Check if user is already a collaborator
    const isAlreadyCollaborator = repository.collaborators.some(
      (collabId) => collabId.toString() === body.userId,
    );

    if (isAlreadyCollaborator) {
      throw new BadRequestException('User is already a collaborator');
    }

    // Check if trying to add owner as collaborator
    if (repository.owner.toString() === body.userId) {
      throw new BadRequestException('Owner cannot be added as collaborator');
    }

    return this.repositoryRepository.addCollaborator(id, body.userId);
  }

  async getRepositoriesByUser(user: JwtPayload): Promise<RepositoryModel[]> {
    return this.repositoryRepository.getRepositoriesByUser(user._id.toString());
  }

  async getCollaborators(id: string, user: JwtPayload): Promise<any> {
    const repository = await this.repositoryRepository.findById(id);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    return {
      owner: repository.owner,
      collaborators: repository.collaborators,
    };
  }

  // Issue Management Methods
  async createIssue(
    repoId: string,
    body: CreateIssueDto,
    user: JwtPayload,
  ): Promise<IssueModel> {
    const repository = await this.repositoryRepository.findById(repoId);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    // Only collaborators can create issues
    const isCollaborator = repository.collaborators.some(
      (collabId) => collabId.toString() === user._id.toString(),
    );

    if (
      !isCollaborator &&
      repository.owner.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException('Only collaborators can create issues');
    }

    const issueData = {
      title: body.title,
      description: body.description || '',
      status: IssueStatus.OPEN,
      labels: body.labels || [],
      createdBy: new Types.ObjectId(user._id),
      assignedTo: body.assignedTo
        ? new Types.ObjectId(body.assignedTo)
        : undefined,
      repoId: new Types.ObjectId(repoId),
    };

    return this.repositoryRepository.createIssue(issueData);
  }

  async getIssues(
    repoId: string,
    filters: IssueFiltersDto,
    user: JwtPayload,
  ): Promise<IssueModel[]> {
    const repository = await this.repositoryRepository.findById(repoId);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    return this.repositoryRepository.getIssuesByRepository(repoId, filters);
  }

  async updateIssueStatus(
    repoId: string,
    issueId: string,
    body: UpdateIssueStatusDto,
    user: JwtPayload,
  ): Promise<IssueModel> {
    const repository = await this.repositoryRepository.findById(repoId);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    const issue = await this.repositoryRepository.findIssueById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    // Verify issue belongs to this repository
    if (issue.repoId.toString() !== repoId) {
      throw new BadRequestException('Issue does not belong to this repository');
    }

    return this.repositoryRepository.updateIssueStatus(issueId, body.status);
  }

  async updateIssue(
    repoId: string,
    issueId: string,
    body: UpdateIssueDto,
    user: JwtPayload,
  ): Promise<IssueModel> {
    const repository = await this.repositoryRepository.findById(repoId);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    const issue = await this.repositoryRepository.findIssueById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    // Verify issue belongs to this repository
    if (issue.repoId.toString() !== repoId) {
      throw new BadRequestException('Issue does not belong to this repository');
    }

    // Only the creator or assigned user can update the issue
    const isCreator = issue.createdBy.toString() === user._id.toString();
    const isAssigned =
      issue.assignedTo && issue.assignedTo.toString() === user._id.toString();

    if (!isCreator && !isAssigned) {
      throw new ForbiddenException(
        'Only the creator or assigned user can update this issue',
      );
    }

    // Convert string IDs to ObjectIds for the update
    const updateData: Partial<IssueModel> = {
      ...body,
      assignedTo: body.assignedTo
        ? new Types.ObjectId(body.assignedTo)
        : undefined,
    };

    return this.repositoryRepository.updateIssue(issueId, updateData);
  }

  async getIssueById(
    repoId: string,
    issueId: string,
    user: JwtPayload,
  ): Promise<IssueModel> {
    const repository = await this.repositoryRepository.findById(repoId);

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    // Check if user has access to this repository
    await this.checkRepositoryAccess(repository, user);

    const issue = await this.repositoryRepository.findIssueById(issueId);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    // Verify issue belongs to this repository
    if (issue.repoId.toString() !== repoId) {
      throw new BadRequestException('Issue does not belong to this repository');
    }

    return issue;
  }

  private async checkRepositoryAccess(
    repository: RepositoryModel,
    user: JwtPayload,
  ): Promise<void> {
    const isOwner = repository.owner.toString() === user._id.toString();
    const isCollaborator = repository.collaborators.some(
      (collabId) => collabId.toString() === user._id.toString(),
    );

    if (!isOwner && !isCollaborator) {
      throw new ForbiddenException('You do not have access to this repository');
    }
  }
}
