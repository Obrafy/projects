import { ErrorMessages } from '../error-messagens.interface';

const errorMessagesEnUs: ErrorMessages = {
    DATABASE: {
        DUPLICATE_KEY: 'a record already exists for key :key: and value :value: (duplicate entry)',
    },
    PROJECT_SERVICE: {
        PROJECT_NOT_FOUND: 'Project was not found',
        PROJECT_ALREADY_EXISTS: 'Project id already exists',
        PROJECT_NOT_ACTIVE: 'Project has been found but is not active',
    },
    TASK_SERVICE: {
        TASK_NOT_FOUND: 'Task was not found',
        TASK_ALREADY_EXISTS: 'Task id already exists',
        TASK_NOT_ACTIVE: 'Task has been found but is not active',
    },
};

export default errorMessagesEnUs;
