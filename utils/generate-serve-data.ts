import formatRes from './format-responses';
import {
  Operation,
  Parameter,
  Reference,
  RequestBody,
  Schema,
} from 'swagger-2-ts-file/lib/openapi';
import handleRef from './handle-ref';
import formatRequestBody from './format-request-body';
import handleSchemaEnum from './handle-schema-enum';
import { FetchMap } from '../type';

export type ServeData = {
  [x: string]: {
    imports?: string[];
    fetchs?: string[];
    entitys?: Array<ServeEntity>;
  };
};

export type ServeEntity = {
  url: string;
  name: string;
  parameters: {
    header?: { [x: string]: ServeParameter } | ServeParameter;
    body?: { [x: string]: ServeParameter } | ServeParameter;
    query?: { [x: string]: ServeParameter } | ServeParameter;
    path?: { [x: string]: ServeParameter } | ServeParameter;
    cookie?: { [x: string]: ServeParameter } | ServeParameter;
  };
  description: string;
  T: string;
  method: keyof FetchMap;
};

export type ServeParameter = {
  description: string;
  type: string;
};

export default (excludeParams: Array<string> = []) => {
  const { getRefName } = handleRef();
  const data: ServeData = {};
  const appendImports = (tag: string, imports: string) => {
    if (!data[tag]) data[tag] = {};
    if (!data[tag].imports) data[tag].imports = [];
    if (
      !data[tag].imports?.includes(imports) &&
      !excludeParams.includes(imports) &&
      imports !== 'any'
    )
      data[tag].imports?.push(imports);
  };
  // const appendFetch = (tag: string, fetchMap: FetchMap, method: keyof FetchMap) => {
  //   if (!fetchMap) throw new Error('fetchMap is required');
  //   if (!fetchMap[method])
  //     throw new Error(`当前请求中时method为${method}的请求，但是fetchMap中没有对应的模版`);
  //   if (!data[tag]) data[tag] = {};
  //   if (!data[tag].fetchs) data[tag].fetchs = [];
  //   const rexg = new RegExp(/(?<=\#)\w+/, 'g');
  //   const result = rexg.exec(fetchMap[method])?.[0];
  //   if (result && !data[tag].fetchs?.includes(result)) data[tag].fetchs?.push(result);
  // };
  const generateEntity = (
    url: string,
    method: keyof FetchMap,
    operation: Operation,
  ): ServeEntity => {
    const { getOk } = formatRes(operation?.responses);
    const { getApplicationJson } = formatRequestBody(operation?.requestBody as RequestBody);
    const T = getRefName(getOk()) ?? (getOk() as Schema).type;
    const appJson = getApplicationJson();
    const data =
      getRefName(appJson) || handleSchemaEnum(appJson as Schema) || (appJson as Schema)?.type;
    const parameters = { header: {}, body: {}, query: {}, path: {}, cookie: {} };
    operation.parameters?.forEach(parameter => {
      const param = getRefName(parameter as Reference);
      if (param) return Object.assign(parameters, { param });
      if (!excludeParams.includes((parameter as Parameter).name)) {
        const name = getRefName((parameter as Parameter).schema);
        const enums = handleSchemaEnum((parameter as Parameter).schema as Schema);
        Object.assign(parameters[(parameter as Parameter).in], {
          [(parameter as Parameter).name]: {
            description: (parameter as Parameter).description ?? '',
            type: name || enums || 'string',
          },
        });
      }
    });
    data &&
      Object.assign(parameters.body, {
        description: (operation?.requestBody as RequestBody)?.description ?? '',
        type: data,
      });
    return {
      name: operation.operationId ?? '',
      url,
      description: `${operation.summary ?? ''} ${operation.description ?? ''}`,
      T,
      parameters,
      method,
    };
  };

  const appendEntity = (tag: string, entity: ServeEntity) => {
    if (!data[tag].entitys) data[tag].entitys = [];
    else data[tag].entitys?.push(entity);
  };

  return { data, appendImports, generateEntity, appendEntity };
};
