import { IssueModel, IssueSchema } from '@models/issue.model';
import { RepositoryModel, RepositorySchema } from '@models/repository.model';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryRepository } from '@repositories/repository.repository';
import { GeneralHelper } from '@utils/general.helper';
import { Logger } from '@utils/logger.service';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepositoryModel.name, schema: RepositorySchema },
      { name: IssueModel.name, schema: IssueSchema },
    ]),
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
  controllers: [RepositoryController],
  providers: [RepositoryService, RepositoryRepository, GeneralHelper, Logger],
  exports: [RepositoryService, RepositoryRepository],
})
export class RepositoryModule {}
