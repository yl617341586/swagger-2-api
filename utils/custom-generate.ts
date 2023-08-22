import type { ServeEntity } from './generate-serve-data';
export default (entity: ServeEntity) => {
  return {
    name: entity.name,
    path: '/fetch',
    content: 'export const $name = ($parameters) => #axios($method, $url, ...$parameters)',
  };
};
