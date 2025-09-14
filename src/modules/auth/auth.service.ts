import { UserType } from '@/contracts/enums/usertype.enum';
import { LoginResponse } from '@/response/auth/auth.response';
import { JwtPayload } from '@contracts/types/jwtPayload.type';
import { UserModel } from '@models/user.model';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@repositories/user.repository';
import { comparePassword, hashPassword } from '@utils/bcrypt.helper';

import { LoginUserDto, SignupDTO } from './auth.dto';
import { Messages } from './messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(body: SignupDTO): Promise<any> {
    const emailExist = await this.userRepository.findByEmail(body.email);

    if (emailExist)
      throw new UnprocessableEntityException(Messages.USER_EXISTS);

    body.password = await hashPassword(body.password);

    const newUser: UserModel = await this.userRepository.create({
      ...body,
      role: UserType.COLLABORATOR,
    });

    const jwtPayload: JwtPayload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);
    delete newUser.password;

    return { user: newUser, accessToken };
  }

  async login(body: LoginUserDto): Promise<LoginResponse> {
    // Find user with password field included using MongoDB syntax
    const user: UserModel = await this.userRepository.findOne(
      { email: body.email },
      undefined,
      '+password',
    );

    if (!user) throw new NotFoundException(Messages.USER_NOT_FOUND);

    const isPasswordValid: boolean = await comparePassword(
      body.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException(Messages.INVALID_PASSWORD);

    delete user.password;

    const jwtPayload: JwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    delete user.password;
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { user, accessToken };
  }
}
