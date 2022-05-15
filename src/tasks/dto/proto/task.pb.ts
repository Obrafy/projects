/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import * as Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';

export const protobufPackage = 'task';

/** Create */
export interface CreateRequest {
  category: string;
  activity: string;
  noiseLevel: string;
  messLevel: string;
  possibleSkills: PossibleSkills[];
}

export interface CreateResponse {
  status: number;
  error: string;
  data: TaskDataResponse | undefined;
}

/** FindAll */
export interface FindAllRequest {}

export interface FindAllResponse {
  status: number;
  error: string;
  data: TaskDataResponse[];
}

/** FindOne */
export interface FindOneRequest {
  id: string;
}

export interface FindOneResponse {
  status: number;
  error: string;
  data: TaskDataResponse | undefined;
}

/** update */
export interface UpdateRequest {
  id: string;
  data: TaskDataRequest | undefined;
}

export interface UpdateResponse {
  status: number;
  error: string;
  data: TaskDataResponse | undefined;
}

/** remove */
export interface RemoveRequest {
  id: string;
}

export interface RemoveResponse {
  status: number;
  error: string;
}

export interface TaskDataResponse {
  category: string;
  activity: string;
  noiseLevel: string;
  messLevel: string;
  possibleSkills: PossibleSkills[];
  id: string;
}

export interface TaskDataRequest {
  category: string;
  activity: string;
  noiseLevel: string;
  messLevel: string;
  possibleSkills: PossibleSkills[];
  id: string;
}

export interface PossibleSkills {
  skillId: string;
  requiredSkillLevel: number;
}

export const TASK_PACKAGE_NAME = 'task';

export interface TaskServiceClient {
  create(request: CreateRequest): Observable<CreateResponse>;

  findAll(request: FindAllRequest): Observable<FindAllResponse>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  update(request: UpdateRequest): Observable<UpdateResponse>;

  remove(request: RemoveRequest): Observable<RemoveResponse>;
}

export interface TaskServiceController {
  create(
    request: CreateRequest,
  ): Promise<CreateResponse> | Observable<CreateResponse> | CreateResponse;

  findAll(
    request: FindAllRequest,
  ): Promise<FindAllResponse> | Observable<FindAllResponse> | FindAllResponse;

  findOne(
    request: FindOneRequest,
  ): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  update(
    request: UpdateRequest,
  ): Promise<UpdateResponse> | Observable<UpdateResponse> | UpdateResponse;

  remove(
    request: RemoveRequest,
  ): Promise<RemoveResponse> | Observable<RemoveResponse> | RemoveResponse;
}

export function TaskServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'findAll',
      'findOne',
      'update',
      'remove',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('TaskService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('TaskService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const TASK_SERVICE_NAME = 'TaskService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
