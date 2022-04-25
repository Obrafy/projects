import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project, ProjectSchema } from './entities/project.entity';
import { Address, AddressSchema } from './entities/address.entity';
import { TasksModule } from 'src/tasks/tasks.module';

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
      }
    ])
  ],
})
export class ProjectsModule { }
