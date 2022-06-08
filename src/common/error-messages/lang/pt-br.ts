import { ErrorMessages } from '../error-messagens.interface';

const errorMessagesPtBr: ErrorMessages = {
  DATABASE: {
    DUPLICATE_KEY: 'um registro já existe para a chave única `:key:` com o valor `:value:`',
  },
  PROJECT_SERVICE: {
    PROJECT_NOT_FOUND: 'Projeto não foi encontrado',
    PROJECT_ALREADY_EXISTS: 'Projeto id já existe',
    PROJECT_NOT_ACTIVE: 'Projeto foi encontrado porém não está ativa',
    PROJECT_TASK_ALREADY_ASSIGNED: 'Adicionando tarefa que já existe no projeto',
  },
  TASK_SERVICE: {
    TASK_NOT_FOUND: 'Tarefa não foi encontrada',
    TASK_ALREADY_EXISTS: 'Tarefa id já existe',
    TASK_NOT_ACTIVE: 'Tarefa foi encontrada porém não está ativa',
    TASK_SKILL_ALREADY_ASSIGNED: 'Adicionando habilidade que já existe na tarefa',
    TASK_NOT_FOUND_IN_PROJECT: 'Tarefa não foi encontrada no projeto',
  },
};

export default errorMessagesPtBr;
