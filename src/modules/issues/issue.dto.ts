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
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 200)
  @Trim()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 2000)
  @Trim()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}

export class UpdateIssueDto {
  @ApiProperty()
  @IsOptional()
  @Length(1, 200)
  @Trim()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 2000)
  @Trim()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}

export class UpdateIssueStatusDto {
  @ApiProperty({ enum: IssueStatus })
  @IsNotEmpty()
  @IsEnum(IssueStatus)
  status: IssueStatus;
}

export class IssueFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  labels?: string; // Comma-separated labels

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
