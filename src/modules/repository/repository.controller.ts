import { UserType } from '@/contracts/enums/usertype.enum';
import { JwtPayload } from '@/contracts/types/jwtPayload.type';
import { User } from '@/decorators/user.decorator';
import { AuthGuardFactory } from '@/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '@utils/base.controller';
import { Response } from 'express';
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
import { RepositoryService } from './repository.service';

@ApiTags('Repository & Issues Management')
@ApiBearerAuth('JWT')
@Controller('repos')
export class RepositoryController extends BaseController {
  constructor(private repositoryService: RepositoryService) {
    super();
  }

  // Repository endpoints
  @UseGuards(AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR]))
  @Post('')
  @ApiOperation({
    summary: 'Create a new repository',
    description:
      'Creates a new repository. Only OWNER and COLLABORATOR roles can create repositories.',
  })
  @ApiResponse({
    status: 201,
    description: 'Repository created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Repository created successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'my-awesome-repo' },
            description: {
              type: 'string',
              example: 'A repository for awesome code',
            },
            owner: { type: 'string', example: '507f1f77bcf86cd799439012' },
            collaborators: {
              type: 'array',
              items: { type: 'string' },
              example: [],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Repository with this name already exists',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiBody({ type: CreateRepositoryDto })
  async create(
    @Body() createRepositoryDto: CreateRepositoryDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const repository = await this.repositoryService.create(
      createRepositoryDto,
      user,
    );
    return this.OKResponse(res, repository);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get(':id')
  @ApiOperation({
    summary: 'Get repository by ID',
    description:
      'Retrieves a specific repository by its ID. User must be owner, collaborator, or viewer.',
  })
  @ApiParam({
    name: 'id',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Repository retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'my-awesome-repo' },
            description: {
              type: 'string',
              example: 'A repository for awesome code',
            },
            owner: { type: 'object', description: 'Owner user object' },
            collaborators: {
              type: 'array',
              items: { type: 'object' },
              description: 'Collaborator user objects',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getById(
    @Param('id') id: string,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const repository = await this.repositoryService.getById(id, user);
    return this.OKResponse(res, repository);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get('')
  @ApiOperation({
    summary: 'Get user repositories',
    description:
      'Retrieves all repositories where the user is owner or collaborator.',
  })
  @ApiResponse({
    status: 200,
    description: 'Repositories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              name: { type: 'string', example: 'my-awesome-repo' },
              description: {
                type: 'string',
                example: 'A repository for awesome code',
              },
              owner: { type: 'object', description: 'Owner user object' },
              collaborators: { type: 'array', items: { type: 'object' } },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async getRepositoriesByUser(@Res() res: Response, @User() user: JwtPayload) {
    const repositories =
      await this.repositoryService.getRepositoriesByUser(user);
    return this.OKResponse(res, repositories);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get(':id/collaborators')
  @ApiOperation({
    summary: 'Get repository collaborators',
    description: 'Retrieves all collaborators of a specific repository.',
  })
  @ApiParam({
    name: 'id',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Collaborators retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            owner: { type: 'object', description: 'Owner user object' },
            collaborators: {
              type: 'array',
              items: { type: 'object' },
              description: 'Collaborator user objects',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getCollaborators(
    @Param('id') id: string,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const collaborators = await this.repositoryService.getCollaborators(
      id,
      user,
    );
    return this.OKResponse(res, collaborators);
  }

  @UseGuards(AuthGuardFactory([UserType.OWNER]))
  @Put(':id')
  @ApiOperation({
    summary: 'Update repository',
    description:
      'Updates repository details. Only the repository owner can update.',
  })
  @ApiParam({
    name: 'id',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Repository updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'updated-repo-name' },
            description: { type: 'string', example: 'Updated description' },
            owner: { type: 'object', description: 'Owner user object' },
            collaborators: { type: 'array', items: { type: 'object' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 403, description: 'Only repository owner can update' })
  @ApiBody({ type: UpdateRepositoryDto })
  async update(
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const repository = await this.repositoryService.update(
      id,
      updateRepositoryDto,
      user,
    );
    return this.OKResponse(res, repository);
  }

  @UseGuards(AuthGuardFactory([UserType.OWNER]))
  @Post(':id/collaborators')
  @ApiOperation({
    summary: 'Add collaborator to repository',
    description:
      'Adds a user as a collaborator to the repository. Only the repository owner can add collaborators.',
  })
  @ApiParam({
    name: 'id',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Collaborator added successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'my-awesome-repo' },
            description: {
              type: 'string',
              example: 'A repository for awesome code',
            },
            owner: { type: 'object', description: 'Owner user object' },
            collaborators: {
              type: 'array',
              items: { type: 'object' },
              description: 'Updated collaborators list',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({
    status: 400,
    description:
      'User is already a collaborator or owner cannot be added as collaborator',
  })
  @ApiResponse({
    status: 403,
    description: 'Only repository owner can add collaborators',
  })
  @ApiBody({ type: AddCollaboratorDto })
  async addCollaborator(
    @Param('id') id: string,
    @Body() addCollaboratorDto: AddCollaboratorDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const repository = await this.repositoryService.addCollaborator(
      id,
      addCollaboratorDto,
      user,
    );
    return this.OKResponse(res, repository);
  }

  @UseGuards(AuthGuardFactory([UserType.OWNER]))
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete repository',
    description:
      'Permanently deletes a repository. Only the repository owner can delete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Repository deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            deleted: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 403, description: 'Only repository owner can delete' })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const result = await this.repositoryService.delete(id, user);
    return this.OKResponse(res, { deleted: result });
  }

  // Issue endpoints
  @UseGuards(AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR]))
  @Post(':repoId/issues')
  @ApiOperation({
    summary: 'Create a new issue',
    description:
      'Creates a new issue in the repository. Only collaborators can create issues.',
  })
  @ApiParam({
    name: 'repoId',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'Issue created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            title: { type: 'string', example: 'Fix login bug' },
            description: {
              type: 'string',
              example: 'Users cannot login with valid credentials',
            },
            status: {
              type: 'string',
              enum: ['open', 'in-progress', 'closed'],
              example: 'open',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              example: ['bug', 'high-priority'],
            },
            createdBy: { type: 'object', description: 'Creator user object' },
            assignedTo: { type: 'object', description: 'Assigned user object' },
            repoId: { type: 'object', description: 'Repository object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({
    status: 403,
    description: 'Only collaborators can create issues',
  })
  @ApiBody({ type: CreateIssueDto })
  async createIssue(
    @Param('repoId') repoId: string,
    @Body() createIssueDto: CreateIssueDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const issue = await this.repositoryService.createIssue(
      repoId,
      createIssueDto,
      user,
    );
    return this.OKResponse(res, issue);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get(':repoId/issues')
  @ApiOperation({
    summary: 'Get repository issues',
    description:
      'Retrieves all issues in a repository with optional filtering.',
  })
  @ApiParam({
    name: 'repoId',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['open', 'in-progress', 'closed'],
    description: 'Filter by issue status',
  })
  @ApiQuery({
    name: 'labels',
    required: false,
    type: 'string',
    description: 'Comma-separated labels to filter by',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: 'string',
    description: 'Filter by assigned user ID',
  })
  @ApiQuery({
    name: 'createdBy',
    required: false,
    type: 'string',
    description: 'Filter by creator user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Issues retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
              title: { type: 'string', example: 'Fix login bug' },
              description: {
                type: 'string',
                example: 'Users cannot login with valid credentials',
              },
              status: {
                type: 'string',
                enum: ['open', 'in-progress', 'closed'],
                example: 'open',
              },
              labels: {
                type: 'array',
                items: { type: 'string' },
                example: ['bug', 'high-priority'],
              },
              createdBy: { type: 'object', description: 'Creator user object' },
              assignedTo: {
                type: 'object',
                description: 'Assigned user object',
              },
              repoId: { type: 'object', description: 'Repository object' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getIssues(
    @Param('repoId') repoId: string,
    @Query() filters: IssueFiltersDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const issues = await this.repositoryService.getIssues(
      repoId,
      filters,
      user,
    );
    return this.OKResponse(res, issues);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get(':repoId/issues/:issueId')
  @ApiOperation({
    summary: 'Get issue by ID',
    description: 'Retrieves a specific issue by its ID.',
  })
  @ApiParam({
    name: 'repoId',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'issueId',
    description: 'Issue ID',
    example: '507f1f77bcf86cd799439013',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            title: { type: 'string', example: 'Fix login bug' },
            description: {
              type: 'string',
              example: 'Users cannot login with valid credentials',
            },
            status: {
              type: 'string',
              enum: ['open', 'in-progress', 'closed'],
              example: 'open',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              example: ['bug', 'high-priority'],
            },
            createdBy: { type: 'object', description: 'Creator user object' },
            assignedTo: { type: 'object', description: 'Assigned user object' },
            repoId: { type: 'object', description: 'Repository object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository or issue not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getIssueById(
    @Param('repoId') repoId: string,
    @Param('issueId') issueId: string,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const issue = await this.repositoryService.getIssueById(
      repoId,
      issueId,
      user,
    );
    return this.OKResponse(res, issue);
  }

  @UseGuards(AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR]))
  @Patch(':repoId/issues/:issueId/status')
  @ApiOperation({
    summary: 'Update issue status',
    description: 'Updates the status of an issue (open, in-progress, closed).',
  })
  @ApiParam({
    name: 'repoId',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'issueId',
    description: 'Issue ID',
    example: '507f1f77bcf86cd799439013',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            title: { type: 'string', example: 'Fix login bug' },
            description: {
              type: 'string',
              example: 'Users cannot login with valid credentials',
            },
            status: {
              type: 'string',
              enum: ['open', 'in-progress', 'closed'],
              example: 'in-progress',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              example: ['bug', 'high-priority'],
            },
            createdBy: { type: 'object', description: 'Creator user object' },
            assignedTo: { type: 'object', description: 'Assigned user object' },
            repoId: { type: 'object', description: 'Repository object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository or issue not found' })
  @ApiResponse({
    status: 400,
    description: 'Issue does not belong to this repository',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiBody({ type: UpdateIssueStatusDto })
  async updateIssueStatus(
    @Param('repoId') repoId: string,
    @Param('issueId') issueId: string,
    @Body() updateIssueStatusDto: UpdateIssueStatusDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const issue = await this.repositoryService.updateIssueStatus(
      repoId,
      issueId,
      updateIssueStatusDto,
      user,
    );
    return this.OKResponse(res, issue);
  }

  @UseGuards(AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR]))
  @Put(':repoId/issues/:issueId')
  @ApiOperation({
    summary: 'Update issue details',
    description:
      'Updates issue details (title, description, labels, assignedTo). Only creator or assigned user can update.',
  })
  @ApiParam({
    name: 'repoId',
    description: 'Repository ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'issueId',
    description: 'Issue ID',
    example: '507f1f77bcf86cd799439013',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            title: { type: 'string', example: 'Updated issue title' },
            description: {
              type: 'string',
              example: 'Updated issue description',
            },
            status: {
              type: 'string',
              enum: ['open', 'in-progress', 'closed'],
              example: 'open',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              example: ['bug', 'urgent'],
            },
            createdBy: { type: 'object', description: 'Creator user object' },
            assignedTo: { type: 'object', description: 'Assigned user object' },
            repoId: { type: 'object', description: 'Repository object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Repository or issue not found' })
  @ApiResponse({
    status: 400,
    description: 'Issue does not belong to this repository',
  })
  @ApiResponse({
    status: 403,
    description: 'Only creator or assigned user can update this issue',
  })
  @ApiBody({ type: UpdateIssueDto })
  async updateIssue(
    @Param('repoId') repoId: string,
    @Param('issueId') issueId: string,
    @Body() updateIssueDto: UpdateIssueDto,
    @Res() res: Response,
    @User() user: JwtPayload,
  ) {
    const issue = await this.repositoryService.updateIssue(
      repoId,
      issueId,
      updateIssueDto,
      user,
    );
    return this.OKResponse(res, issue);
  }
}
