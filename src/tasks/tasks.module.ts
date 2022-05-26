import { Module } from '@nestjs/common';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigInterface } from 'src/config';
import { makeMicroserviceUrl } from 'src/common/helpers/make-microservice';
import { AUTH_PACKAGE_NAME, SKILL_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),

    ClientsModule.registerAsync([
      {
        name: SKILL_MANAGEMENT_SERVICE_NAME,
        useFactory: (configService: ConfigService<ConfigInterface>) => ({
          transport: Transport.GRPC,
          options: {
            url: makeMicroserviceUrl(
              configService.get('AUTHENTICATION_HOST', { infer: true }),
              configService.get('AUTHENTICATION_PORT', { infer: true }),
            ),
            package: AUTH_PACKAGE_NAME,
            protoPath: join(
              'node_modules',
              'proto',
              'proto-files',
              'authentication-service',
              'auth.proto',
            ),
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
})
export class TasksModule {}
