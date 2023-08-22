import { RequestBody } from 'swagger-2-ts-file/lib/openapi';
export default (requestBody?: RequestBody) => {
  const getApplicationJson = () => requestBody?.content?.['application/json']?.schema;
  return { getApplicationJson };
};
