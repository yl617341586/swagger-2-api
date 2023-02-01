const analyzeEntity = require('./analyze-entity');

module.exports = (name, json, fetchMap) => {
  const imports = [];
  for (const key in json.paths) {
    const { method, param, tag } = analyzeEntity(key, json);
    if (tag === name && !imports.includes(fetchMap[method].name))
      imports.push(fetchMap[method].name);
  }
  return imports.length ? `import { ${imports} } from '@/utils/fetch'` : '';
};
