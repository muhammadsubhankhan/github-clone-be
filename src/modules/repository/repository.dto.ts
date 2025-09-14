import { Trim } from '@/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRepositoryDto {
  @ApiProperty({
    description: 'Repository name',
    example: 'my-awesome-repository',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  @Length(1, 100)
  @Trim()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Repository description',
    example: 'A repository for awesome code and projects',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @Length(0, 500)
  @Trim()
  @IsString()
  description?: string;
}

export class UpdateRepositoryDto {
  @ApiProperty({
    description: 'Updated repository name',
    example: 'updated-repository-name',
    required: false,
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @Length(1, 100)
  @Trim()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Updated repository description',
    example: 'Updated description for the repository',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @Length(0, 500)
  @Trim()
  @IsString()
  description?: string;
}

export class AddCollaboratorDto {
  @ApiProperty({
    description: 'User ID to add as collaborator',
    example: '507f1f77bcf86cd799439012',
    type: 'string',
    format: 'ObjectId',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

export class RemoveCollaboratorDto {
  @ApiProperty({
    description: 'User ID to remove from collaborators',
    example: '507f1f77bcf86cd799439012',
    type: 'string',
    format: 'ObjectId',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
