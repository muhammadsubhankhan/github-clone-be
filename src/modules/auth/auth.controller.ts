import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@utils/base.controller';
import { Response } from 'express';
import { LoginUserDto, SignupDTO } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('signup')
  async signup(@Body() body: SignupDTO, @Res() res: Response) {
    const data = await this.authService.signup(body);

    return this.OKResponse(res, data);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const data = await this.authService.login(body);
    return this.OKResponse(res, data);
  }
}
