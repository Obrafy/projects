import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProjectsModule } from './projects/projects.module';
import { ConfigInterface, loader, validationSchema } from './config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loader],
      validationSchema: validationSchema,
      expandVariables: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigInterface>) => ({
        uri: configService.get('DB_URI', { infer: true }),
        autoIndex: true,
      }),
    }),

    ProjectsModule,

    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
