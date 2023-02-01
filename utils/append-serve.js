const analyzeEntity = require('./analyze-entity');
const { appendFileSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { cwd } = require('process');
const appendEntity = require('./append-entity');

const checkIsRefType = (schema = {}) =>
  Object.prototype.hasOwnProperty.call(schema, 'originalRef') ||
  Object.prototype.hasOwnProperty.call(schema, '$ref');
const generateRef = schema =>
  schema?.originalRef?.replace(/\«|\»/g, '') ||
  schema?.$ref?.substring(schema?.$ref.lastIndexOf('/') + 1).replace(/\«|\»/g, '');
const checkIsEnumType = items => Object.prototype.hasOwnProperty.call(items, 'enum');
const generateArrayType = items => {
  if (checkIsRefType(items.schema)) return `Array<${generateRef(items.schema)}>`;
  else if (checkIsEnumType(items)) {
    const arrStr = JSON.stringify(items?.enum).replace(/,/g, ' | ');
    return `Array<${arrStr.substring(1, arrStr.length - 1)}>`;
  }
  switch (items?.type) {
    case 'integer':
      return `Array<number>`;
    default:
      return `Array<${items?.type}>`;
  }
};
const generateStrType = items => {
  if (checkIsEnumType(items)) {
    const arrStr = JSON.stringify(items?.enum).replace(/,/g, ' | ');
    return String(arrStr.substring(1, arrStr.length - 1));
  }
  return items?.type;
};
const generateNumberType = item => {
  if (checkIsEnumType(item)) {
    const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
    return String(arrStr.substring(1, arrStr.length - 1));
  }
  return 'number';
};
const generateBooleanType = item => {
  if (checkIsEnumType(item)) {
    const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
    return String(arrStr.substring(1, arrStr.length - 1));
  }
  return item?.type;
};
const handleAttributes = item => {
  if (item.type)
    switch (item.type) {
      case 'string':
        return generateStrType(item);
      case 'boolean':
        return generateBooleanType(item);
      case 'integer':
        return generateNumberType(item);
      case 'array':
        return generateArrayType(item.items);
      case 'file':
        return 'FormData';
    }
  else if (checkIsRefType(item.schema)) {
    return generateRef(item.schema);
  }
};
module.exports = (json, excludeParam, fetchMap) => {
  for (const key in json.paths) {
    const { path, method, tag, param, name, summary, responses } = analyzeEntity(
      key,
      json,
      excludeParam,
    );
    const serveData =
      readFileSync(resolve(cwd(), 'src', 'api', `${tag.replace(/\//g, '-')}.ts`), {
        encoding: 'utf-8',
      }).match(/(?<=export const\s)([\w].*?)(?=\s)/g) || [];
    if (serveData.includes(name)) continue;
    const note = param.length
      ? `/**
     * ${summary || ''}
     ${param
       .map(
         ({ name, description }, key) =>
           `${key ? '\n ' : ''}* @param ${name} ${description || name}`,
       )
       .join('')}
     */
        `
      : `/**
      * ${summary || ''}
      */
         `;
    const func = `export const ${name} = (${param
      .map((item, key) => `${item.name}${item.required ? '' : '?'}: ${handleAttributes(item)} ,`)
      .join('')}) => ${appendEntity(fetchMap[method], path, param, responses)}
      `;
    const serve = `${note}${func}`;
    appendFileSync(resolve(cwd(), 'src', 'api', `${tag.replace(/\//g, '-')}.ts`), serve);
  }
};
