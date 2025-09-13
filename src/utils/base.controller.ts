/* eslint-disable  */
import { ResponseCode } from '@enums/response.code';
import { ResponseMessage } from '@enums/response.message';
import { IResponseJson } from '@interfaces/response.interface';
import { Response } from 'express';

export class BaseController {
  private getResponse = (res: Response, data: IResponseJson) => {
    return res.status(data.code).json(data);
  };

  protected CreatedResponse = (res: Response, data: any) => {
    return this.getResponse(res, {
      data: data,
      code: ResponseCode.CREATED,
      message: ResponseMessage.SUCCESS,
    });
  };

  protected OKResponse = (res: Response, data: any) => {
    return this.getResponse(res, {
      data: data,
      code: ResponseCode.OK,
      message: ResponseMessage.SUCCESS,
    });
  };
}
