import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

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
  ],
})
export class TasksModule {}
