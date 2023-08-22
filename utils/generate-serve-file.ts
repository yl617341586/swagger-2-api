import { writeFileSync, appendFileSync, access, constants, readdirSync, readFileSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
import { OpenApi, Operation } from 'swagger-2-ts-file/lib/openapi';
import { FetchMap, GenerateServeFileOptions } from '../type';
import generateHeaderFragment from './generate-header-fragment';
import replaceHeaderFragment from './replace-header-fragment';
import generateServeData from './generate-serve-data';
import handleRef from './handle-ref';
import formatRes from './format-responses';
import formatRequestBody from './format-request-body';

export default (openapi: OpenApi, options: GenerateServeFileOptions) => {
  const baseUrl = openapi.servers?.[0]?.url ?? '';
  const { data, generateEntity, appendImports, appendEntity } = generateServeData(
    options.excludeParams,
  );
  const { getRefName } = handleRef();
  const files = readdirSync(options.path);
  const createFile = (fileName: string, headerFragment: string) => {
    if (files.includes(fileName))
      // 重写文件头
      return replaceHeaderFragment(resolve(options.path, fileName), headerFragment);
    // 写文件头
    writeFileSync(resolve(options.path, fileName), headerFragment, { encoding: 'utf-8' });
  };
  Object.entries(openapi.paths).forEach(([path, pathItem]) => {
    const url = `${baseUrl}${path}`;
    Object.entries(pathItem).forEach(([method, operation]) => {
      const localTags = (operation as Operation)?.tags ?? [];
      const headerFragment = generateHeaderFragment(openapi.tags, localTags, options.headerInfo);
      const { getOk } = formatRes(operation?.responses);
      const { getApplicationJson } = formatRequestBody(operation?.requestBody);
      const name = getRefName(getOk());
      const requestBodyName = getRefName(getApplicationJson());
      const entity = generateEntity(url, method as keyof FetchMap, operation);
      localTags.forEach(tag => {
        createFile(`${tag}.${options.mode}`, headerFragment);
        if (name) appendImports(tag, name);
        if (requestBodyName) appendImports(tag, requestBodyName);
        appendEntity(tag, entity);
      });
    });
  });
  Object.entries(data).forEach(([tag, serveData]) => {
    const fileName = resolve(options.path, `${tag}.${options.mode}`);
    const result = new RegExp(/^[\s\S]+?(?=\.)/, 'g').exec(options.typeFileName);
    let apiData = readFileSync(fileName, { encoding: 'utf-8' });
    const checkImportedReg = new RegExp(/import\s+{[\s\S]+?}\s+from/, 'g');
    const fetchImports: Record<string, Array<string>> = {};

    if (!checkImportedReg.test(apiData)) {
      // 生成import
      appendFileSync(
        fileName,
        `\nimport { ${serveData.imports} } from './${result?.[0] ?? 'type.ts'}'\n`,
        {
          encoding: 'utf-8',
        },
      );
      // 生成fetch占位符
      appendFileSync(fileName, `\n$fetch\n`, { encoding: 'utf-8' });
    }

    // 生成请求主体
    serveData.entitys?.forEach(entity => {
      const { name, path, content } = options.custom(entity);
      if (!fetchImports?.[path]) Object.assign(fetchImports, { [path]: [] });
      if (!fetchImports[path].includes(name)) fetchImports[path].push(name);
      if (!apiData.substring(apiData.lastIndexOf('from')).includes(entity.name))
        appendFileSync(fileName, `\n${content}\n`, { encoding: 'utf-8' });
      apiData = readFileSync(fileName, { encoding: 'utf-8' });
    });

    // 替换fetch占位符
    if (apiData.includes('$fetch')) {
      apiData = apiData.replace(
        '$fetch',
        Object.entries(fetchImports)
          .map(([path, names]) => `import { ${names} } from '${path}'`)
          .join('\n'),
      );
      writeFileSync(fileName, apiData, { encoding: 'utf-8' });
    }
  });
};
