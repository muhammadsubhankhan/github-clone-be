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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Repository')
@ApiBearerAuth('JWT')
@Controller('repos')
export class RepositoryController extends BaseController {
  constructor(private repositoryService: RepositoryService) {
    super();
  }

  // Repository endpoints
  @UseGuards(AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR]))
  @Post('')
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
  async getRepositoriesByUser(@Res() res: Response, @User() user: JwtPayload) {
    const repositories =
      await this.repositoryService.getRepositoriesByUser(user);
    return this.OKResponse(res, repositories);
  }

  @UseGuards(
    AuthGuardFactory([UserType.OWNER, UserType.COLLABORATOR, UserType.VIEWER]),
  )
  @Get(':id/collaborators')
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
