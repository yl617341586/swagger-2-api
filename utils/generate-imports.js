const analyzeEntity = require('./analyze-entity');
const checkIsRefType = (schema = {}) =>
  Object.prototype.hasOwnProperty.call(schema, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(schema, '$ref') ||
  Object.prototype.hasOwnProperty.call(schema.items || {}, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(schema.items || {}, '$ref');
const generateRef = schema =>
  schema?.originalRef?.replace(/\«|\»/g, '') ||
  schema?.$ref?.substring(schema?.$ref.lastIndexOf('/') + 1).replace(/\«|\»/g, '') ||
  schema?.items?.originalRef?.replace(/\«|\»/g, '') ||
  schema?.items?.$ref?.substring(schema?.items?.$ref.lastIndexOf('/') + 1).replace(/\«|\»/g, '');
module.exports = (name, json, typeFileName = 'type.ts') => {
  const imports = [];
  for (const key in json.paths) {
    const { tag, param, responses } = analyzeEntity(key, json);
    if (tag !== name) continue;
    param.forEach(({ schema }) => {
      if (checkIsRefType(schema) && !imports.includes(generateRef(schema)))
        imports.push(generateRef(schema));
    });
    if (
      checkIsRefType(responses['200'].schema) &&
      !imports.includes(generateRef(responses['200'].schema))
    ) {
      imports.push(generateRef(responses['200'].schema));
    }
  }
  return imports.length ? `import { ${imports} } from './${typeFileName.split('.')[0]}'` : '';
};
