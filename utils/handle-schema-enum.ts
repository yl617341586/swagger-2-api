import { Schema } from 'swagger-2-ts-file/lib/openapi';
export default (schema: Schema): string | null => {
  if (!schema?.enum) return null;
  return schema.enum
    ?.map(item => {
      switch (typeof item) {
        case 'string':
          return `"${item}"`;
        case 'object': {
          throw new Error('暂不支持复杂类型的enum，如果需要请提issue');
        }
        default:
          return item;
      }
    })
    .join(' | ');
};
