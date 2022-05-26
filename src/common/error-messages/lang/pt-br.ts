import { ErrorMessages } from '../error-messagens.interface';

const errorMessagesPtBr: ErrorMessages = {
    DATABASE: {
        DUPLICATE_KEY: 'um registro já existe para a chave única `:key:` com o valor `:value:`',
    },
    PROJECT_SERVICE: {
        PROJECT_NOT_FOUND: 'Projeto não foi encontrado',
        PROJECT_ALREADY_EXISTS: 'Projeto id já existe',
        PROJECT_NOT_ACTIVE: 'Projeto foi encontrado porém não está ativa',
    },
    TASK_SERVICE: {
        TASK_NOT_FOUND: 'Tarefa não foi encontrada',
        TASK_ALREADY_EXISTS: 'Tarefa id já existe',
        TASK_NOT_ACTIVE: 'Tarefa foi encontrada porém não está ativa',
    },
};

export default errorMessagesPtBr;