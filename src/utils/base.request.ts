import { IsNumber, IsOptional } from 'class-validator';

export class PaginationParam {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}

export class PaginationParamForBody {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;
}
