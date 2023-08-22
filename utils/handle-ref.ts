import { Reference, Schema } from 'swagger-2-ts-file/lib/openapi';

export default (schema: Schema | Reference = {}) => {
  const isRef = Object.prototype.hasOwnProperty.call(schema, '$ref');
  const name = isRef ? (schema as Reference)?.$ref.replace('#/components/schemas/', '') : null;
  const getRefName = (schema?: Schema | Reference) => {
    const name = (schema as Reference)?.$ref?.replace('#/components/schemas/', '') ?? null;
    return name === '' ? 'any' : name;
  };
  return { name, getRefName };
};
