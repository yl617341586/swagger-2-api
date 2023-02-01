const checkIsRefType = (schema = {}) =>
  Object.prototype.hasOwnProperty.call(schema, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(schema, '$ref');
const generateRef = schema =>
  schema?.originalRef?.replace(/\«|\»/g, '') ||
  schema?.$ref?.substring(schema?.$ref.lastIndexOf('/') + 1).replace(/\«|\»/g, '');
const generateReturnType = res => {
  if (res.schema?.type === 'array') {
    if (checkIsRefType(res.schema.items)) return `Array<${generateRef(res.schema.items)}>`;
  }
  if (checkIsRefType(res.schema)) return generateRef(res.schema);
  return 'unknown';
};
module.exports = (fetchItem, path, param, responses) => {
  const _header = [];
  const _param = [];
  param.forEach(({ in: _in, name }) => {
    if (['query', 'body'].includes(_in)) _param.push(name);
    else if (_in === 'header') _header.push(name);
  });
  if (_header.length)
    return `${fetchItem.name}<${generateReturnType(
      responses['200'],
    )}>(\`${path}\`, {${_param}}, true, {${_header}})`;
  return `${fetchItem.name}<${generateReturnType(responses['200'])}>(\`${path}\`, {${_param}})`;
};
