const { api2Serve } = require('../lib');
const swaggerJson = require('./swagger.json');
const { run } = api2Serve({
  excludeParams: ['Locale', 'AccountId'],
  mode: 'ts',
});
run(swaggerJson, {
  lint: true,
  custom: entity => {
    const { headers, path, query, body } = entity.parameters;
    const params = Object.assign({}, headers, path, query, body.type && { body });
    const remark = `/**\n * ${entity.description}\n ${Object.entries(params)
      .map(([key, value]) => `* @param {${value.type}} ${key} ${value.description}\n`)
      .join('')}*/\n`;
    return {
      name: `${entity.method}Data`,
      path: '@/fetch',
      content: `${remark}export const ${entity.name} = (${Object.entries(params).map(
        ([key, value]) => `${key}:${value.type}`,
      )}) => ${entity.method}Data(\`${entity.url.replace(
        '{',
        '${',
      )}\`, Object.assign({${Object.entries(query).map(([key]) => key)} }${
        body.type ? ', body' : ''
      }))`,
    };
  },
});
