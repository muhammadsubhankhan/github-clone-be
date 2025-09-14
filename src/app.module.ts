import { getMongooseConfig } from '@/config/database.config';
import { RepositoryModule } from '@modules/repository/repository.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { pinoLoggerConfig } from '@utils/pinoLogger.config';
import { S3Service } from '@utils/s3.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(pinoLoggerConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        getMongooseConfig(configService),
    }),
    RepositoryModule,
  ],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class AppModule {}
