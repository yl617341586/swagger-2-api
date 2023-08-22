import getSwaggerJson from './get-swagger-json';
import { OpenApi } from 'swagger-2-ts-file/lib/openapi';
export default async (openapi: OpenApi | string): Promise<OpenApi> => {
  if (typeof openapi === 'string') {
    if (new RegExp(/^http(|s):/).test(openapi)) return await getSwaggerJson(openapi);
    else throw new Error('请传入一个可访问url，或者openapi json对象。');
  }
  return openapi;
};
