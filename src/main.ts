import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as git from 'git-rev-sync';

async function bootstrap() {
  const config: ConfigService = new ConfigService();
  const port = config.get('PORT') || 3000;
  const domain = config.get('DOMAIN') || 'localhost';
  const environment = config.get('NODE_ENV') || 'local';
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  // Get git version info
  const gitVersion = git.tag();

  const options = new DocumentBuilder()
    .setTitle('Github API')
    .addTag(`Last Commit Message: ${git.message()}`)
    .setVersion(gitVersion)
    .addServer(`${domain}`, environment)
    .setDescription(`Last updated: ${git.date()}`)

    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(port);
}
bootstrap();
