import { Trim } from '@/decorators/trim.decorator';
import { IssueStatus } from '@models/issue.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateIssueDto {
  @ApiProperty({
    description: 'Issue title',
    example: 'Fix login authentication bug',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @Length(1, 200)
  @Trim()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed issue description',
    example:
      'Users are unable to login with valid credentials. The authentication service is returning 500 errors.',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @Length(0, 2000)
  @Trim()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Issue labels for categorization',
    example: ['bug', 'high-priority', 'authentication'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty({
    description: 'User ID to assign the issue to',
    example: '507f1f77bcf86cd799439012',
    required: false,
    type: 'string',
    format: 'ObjectId',
  })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}

export class UpdateIssueDto {
  @ApiProperty({
    description: 'Updated issue title',
    example: 'Updated issue title',
    required: false,
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @Length(1, 200)
  @Trim()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Updated issue description',
    example: 'Updated detailed description of the issue',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @Length(0, 2000)
  @Trim()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Updated issue labels',
    example: ['bug', 'urgent', 'frontend'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty({
    description: 'Updated assigned user ID',
    example: '507f1f77bcf86cd799439012',
    required: false,
    type: 'string',
    format: 'ObjectId',
  })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}

export class UpdateIssueStatusDto {
  @ApiProperty({
    description: 'New issue status',
    enum: IssueStatus,
    example: IssueStatus.IN_PROGRESS,
    enumName: 'IssueStatus',
  })
  @IsNotEmpty()
  @IsEnum(IssueStatus)
  status: IssueStatus;
}

export class IssueFiltersDto {
  @ApiProperty({
    description: 'Filter issues by status',
    enum: IssueStatus,
    example: IssueStatus.OPEN,
    required: false,
    enumName: 'IssueStatus',
  })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiProperty({
    description: 'Filter issues by labels (comma-separated)',
    example: 'bug,high-priority,frontend',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  labels?: string; // Comma-separated labels

  @ApiProperty({
    description: 'Filter issues by assigned user ID',
    example: '507f1f77bcf86cd799439012',
    required: false,
    type: 'string',
    format: 'ObjectId',
  })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @ApiProperty({
    description: 'Filter issues by creator user ID',
    example: '507f1f77bcf86cd799439012',
    required: false,
    type: 'string',
    format: 'ObjectId',
  })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
