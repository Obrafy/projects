import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${process.env.HOST}:${process.env.PORT}`,
        package: ['project'],
        protoPath: [
          join(
            'node_modules',
            'proto',
            'proto-files',
            'project-service',
            'project.proto',
          ),
        ],
      },
    },
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Validate and Transform Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen();
}
bootstrap();
