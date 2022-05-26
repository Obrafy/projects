import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project, ProjectSchema } from './entities/project.entity';
import { Address, AddressSchema } from './entities/address.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, USER_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigInterface } from 'src/config';
import { makeMicroserviceUrl } from 'src/common/helpers/make-microservice';
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    TasksModule,

    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: USER_MANAGEMENT_SERVICE_NAME,
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
export class ProjectsModule {}
