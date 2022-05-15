/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import * as Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';

export const protobufPackage = 'project';

export interface ProjectCreateRequest {
  startDate: string;
  expectedFinishedDate: string;
  responsible: string;
  address: Address | undefined;
  tasks: Task[];
}

export interface ProjectCreateResponse {
  status: number;
  error: string;
}

export interface FindAllRequest {}

export interface FindAllResponse {
  status: number;
  error: string;
  data: FindAllData[];
}

export interface FindAllData {
  status: string;
  startDate: number;
  expectedFinishedDate: number;
  responsible: string;
  address: Address | undefined;
  /** repeated ProjectTasks tasks = 7; */
  id: string;
}

export interface FindOneRequest {
  id: string;
}

export interface FindOneResponse {
  status: number;
  error: string;
  data: FindOnData | undefined;
}

export interface FindOnData {
  status: string;
  startDate: number;
  expectedFinishedDate: number;
  responsible: string;
  address: Address | undefined;
  id: string;
}

export interface UpdateRequest {
  id: string;
  data: UpdateProjectData | undefined;
}

export interface UpdateResponse {
  status: number;
  error: string;
  data: UpdateData | undefined;
}

export interface UpdateData {
  status: string;
  startDate: number;
  expectedFinishedDate: number;
  responsible: string;
  address: Address | undefined;
  id: string;
}

export interface UpdateProjectData {
  status: string;
  startDate: string;
  expectedFinishedDate: string;
  responsible: string;
}

export interface RemoveRequest {
  id: string;
}

export interface RemoveResponse {
  status: number;
  error: string;
}

export interface FindAllTaskOfProjectRequest {
  id: string;
}

export interface FindAllTaskOfProjectResponse {
  status: number;
  error: string;
  data: FindAllTaskOfProjectData[];
}

export interface FindAllTaskOfProjectData {
  category: string;
  activity: string;
  noiseLevel: string;
  messLevel: string;
}

/**  */
export interface Address {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Task {
  category: string;
  activity: string;
  noiseLevel: string;
  messLevel: string;
  possibleSkills: PossibleSkills[];
}

export interface ProjectTasks {
  task: string;
  fieldsOverwriters: FieldsOverwriters | undefined;
}

export interface PossibleSkills {
  skillId: string;
  requiredSkillLevel: number;
}

export interface FieldsOverwriters {
  category: string;
  activity: string;
  noiseLevel: string;
  dirtyLevel: string;
}

export const PROJECT_PACKAGE_NAME = 'project';

export interface ProjectServiceClient {
  create(request: ProjectCreateRequest): Observable<ProjectCreateResponse>;

  findAll(request: FindAllRequest): Observable<FindAllResponse>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  update(request: UpdateRequest): Observable<UpdateResponse>;

  remove(request: RemoveRequest): Observable<RemoveResponse>;

  findAllTaskOfProject(
    request: FindAllTaskOfProjectRequest,
  ): Observable<FindAllTaskOfProjectResponse>;
}

export interface ProjectServiceController {
  create(
    request: ProjectCreateRequest,
  ):
    | Promise<ProjectCreateResponse>
    | Observable<ProjectCreateResponse>
    | ProjectCreateResponse;

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

  findAllTaskOfProject(
    request: FindAllTaskOfProjectRequest,
  ):
    | Promise<FindAllTaskOfProjectResponse>
    | Observable<FindAllTaskOfProjectResponse>
    | FindAllTaskOfProjectResponse;
}

export function ProjectServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'findAll',
      'findOne',
      'update',
      'remove',
      'findAllTaskOfProject',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ProjectService', method)(
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
      GrpcStreamMethod('ProjectService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const PROJECT_SERVICE_NAME = 'ProjectService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
