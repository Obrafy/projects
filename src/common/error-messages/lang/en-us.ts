import { ErrorMessages } from '../error-messagens.interface';

const errorMessagesEnUs: ErrorMessages = {
  DATABASE: {
    DUPLICATE_KEY: 'a record already exists for key :key: and value :value: (duplicate entry)',
  },
  PROJECT_SERVICE: {
    PROJECT_NOT_FOUND: 'Project was not found',
    PROJECT_ALREADY_EXISTS: 'Project id already exists',
    PROJECT_NOT_ACTIVE: 'Project has been found but is not active',
    PROJECT_TASK_ALREADY_ASSIGNED: 'Add task in project that is already assigned',
  },
  TASK_SERVICE: {
    TASK_NOT_FOUND: 'Task was not found',
    TASK_ALREADY_EXISTS: 'Task id already exists',
    TASK_NOT_ACTIVE: 'Task has been found but is not active',
    TASK_SKILL_ALREADY_ASSIGNED: 'Add skill in task that is already assigned',
    TASK_NOT_FOUND_IN_PROJECT: 'Task was not found in project',
  },
};

export default errorMessagesEnUs;
