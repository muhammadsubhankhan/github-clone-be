import { UserRepository } from '@/repositories/user.repository';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { S3Service } from '@/utils/s3.service';
import { UserModel, UserSchema } from '@models/user.model';
import { GeneralHelper } from '@utils/general.helper';
import { Logger } from '@utils/logger.service';
import { MailService } from '@utils/mailService';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    GeneralHelper,
    Logger,
    MailService,
    S3Service,
  ],
})
export class AuthModule {}
