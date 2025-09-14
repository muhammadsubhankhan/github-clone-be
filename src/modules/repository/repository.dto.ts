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
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 100)
  @Trim()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 500)
  @Trim()
  @IsString()
  description?: string;
}

export class UpdateRepositoryDto {
  @ApiProperty()
  @IsOptional()
  @Length(1, 100)
  @Trim()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 500)
  @Trim()
  @IsString()
  description?: string;
}

export class AddCollaboratorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

export class RemoveCollaboratorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
