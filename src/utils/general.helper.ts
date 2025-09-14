/* eslint-disable */
import { IPaginationDBParams } from '@interfaces/paginationDBParams.interface';
import { IPaginationRequestParams } from '@interfaces/paginationRequestParams.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeneralHelper {
  constructor(private configService: ConfigService) {}

  getPaginationOptions(params: IPaginationRequestParams): IPaginationDBParams {
    const pageLimit = this.configService.get('PAGE_LIMIT');
    const options: IPaginationDBParams = {
      limit: pageLimit ? parseInt(pageLimit) : 10,
      offset: 0,
    };

    const limit = params.limit;
    const page = params.page || 1;

    if (limit) {
      options.limit = parseInt(limit.toString());
    }

    if (page) {
      options.offset = options.limit * Math.max(page - 1, 0);
    }
    return options;
  }
}
