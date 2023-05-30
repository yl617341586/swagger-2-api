import { Swagger } from 'swagger-2-ts-file/lib/swagger';
export default (key: string, swagger: Swagger, excludeParam = []) => {
  const generateMethod = item => {
    if (Object.prototype.hasOwnProperty.call(item, 'post')) return 'post';
    else if (Object.prototype.hasOwnProperty.call(item, 'get')) return 'get';
    else if (Object.prototype.hasOwnProperty.call(item, 'delete')) return 'delete';
    else if (Object.prototype.hasOwnProperty.call(item, 'put')) return 'put';
    else
      throw new Error(
        `[Api2ServeWebpackPlugin]: 实体中不包含 method的参数：post | get | delete | put。`,
      );
  };
  const removeGetParamPath = path => path.split('{?')[0];
  const addPathParam = path => path.replace(/\{/g, '${');
  const generatePath = path => {
    path = removeGetParamPath(path);
    path = addPathParam(path);
    return path;
  };
  return {
    method: generateMethod(swagger.paths[key]),
    tag: swagger.paths[key][generateMethod(swagger.paths[key])].tags[0],
    responses: swagger.paths[key][generateMethod(swagger.paths[key])].responses,
    param:
      swagger.paths[key][generateMethod(swagger.paths[key])].parameters
        ?.sort((a, b) => Number(b.required) - Number(a.required))
        .filter(({ name }) => !excludeParam.includes(name)) || [],
    name: swagger.paths[key][generateMethod(swagger.paths[key])].operationId,
    path: `${swagger.basePath}${generatePath(key)}`.replace(/\/\//g, '/'),
    summary: swagger.paths[key][generateMethod(swagger.paths[key])].summary,
  };
};
