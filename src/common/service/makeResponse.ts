import { HttpStatus } from '@nestjs/common';

export function makeResponse(status: HttpStatus, error: string, data) {
  return { status, error, data };
}
