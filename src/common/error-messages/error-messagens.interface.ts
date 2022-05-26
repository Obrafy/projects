// Error Messages Interfaces

interface DatabaseErrorMessages {
    DUPLICATE_KEY: string;
}
interface ProjectErrorMessages {
    PROJECT_NOT_FOUND: string;
    PROJECT_ALREADY_EXISTS: string;
    PROJECT_NOT_ACTIVE: string;
}

interface TaskErrorMessages {
    TASK_NOT_FOUND: string;
    TASK_ALREADY_EXISTS: string;
    TASK_NOT_ACTIVE: string;
}

export interface ErrorMessages {
    DATABASE: DatabaseErrorMessages;
    PROJECT_SERVICE: ProjectErrorMessages;
    TASK_SERVICE: TaskErrorMessages;
}

// Error Messages Key Enums
export enum DATABASE_ERROR_MESSAGES_KEYS {
    DUPLICATE_KEY = 'DATABASE.DUPLICATE_KEY',
}

export enum PROJECT_ERROR_MESSAGES_KEYS {
    PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
    PROJECT_ALREADY_EXISTS = 'PROJECT_ALREADY_EXISTS',
    PROJECT_NOT_ACTIVE = 'PROJECT_NOT_ACTIVE',
}

export enum TASK_ERROR_MESSAGES_KEYS {
    TASK_NOT_FOUND = 'TASK_NOT_FOUND',
    TASK_ALREADY_EXISTS = 'TASK_ALREADY_EXISTS',
    TASK_NOT_ACTIVE = 'TASK_NOT_ACTIVE',
}
