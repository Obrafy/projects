export * from '@nestjs/config';
export { default as loader } from './loader';
export { default as validationSchema } from './validation-schema';

export interface ConfigInterface {
  NODE_ENV: string;
  PORT: number;

  SERVER_LANG: string;

  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_BASE_URI: string;
  DB_URI: string;

  AUTHENTICATION_HOST: string;
  AUTHENTICATION_PORT: number;
}
