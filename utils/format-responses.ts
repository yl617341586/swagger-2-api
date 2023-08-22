import { Responses, Response, MediaType, Schema, Reference } from 'swagger-2-ts-file/lib/openapi';
export default (responses: Responses) => {
  const getOk = (): Schema | Reference => {
    return (
      ((responses?.['200'] ?? responses?.['201']) as Response).content?.[
        'application/json'
      ] as MediaType
    ).schema as Schema | Reference;
  };
  return { getOk };
};
