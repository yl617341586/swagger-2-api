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
module.exports = (key, json, excludeParam = []) => {
  return {
    method: generateMethod(json.paths[key]),
    tag: json.paths[key][generateMethod(json.paths[key])].tags[0],
    responses: json.paths[key][generateMethod(json.paths[key])].responses,
    param:
      json.paths[key][generateMethod(json.paths[key])].parameters
        ?.sort((a, b) => Number(b.required) - Number(a.required))
        .filter(({ name }) => !excludeParam.includes(name)) || [],
    name: json.paths[key][generateMethod(json.paths[key])].operationId,
    path: `${json.basePath}${generatePath(key)}`.replace(/\/\//g, '/'),
    summary: json.paths[key][generateMethod(json.paths[key])].summary,
  };
};
