import { OpenApi } from 'swagger-2-ts-file/lib/openapi';
import { generateTypeFile } from 'swagger-2-ts-file';
import { resolve } from 'path';
import { cwd } from 'process';
import { openapiInputFormat, generateServeFile, eslintServe, customGenerate } from './utils';
import { InitOption, RunOptions } from './type';

export const api2Serve = (option: InitOption) => {
  const run = async (
    openapi: OpenApi | string,
    {
      path = resolve(cwd(), 'api'),
      typeFileName = 'type.ts',
      lint,
      headerInfo,
      custom = customGenerate,
    }: RunOptions = {},
  ) => {
    if (!['js', 'ts'].includes(option.mode)) throw new Error('mode must be js or ts');
    try {
      const json = await openapiInputFormat(openapi);
      // 生成类型文件
      await generateTypeFile(json, resolve(path, typeFileName));
      // 生成服务文件
      generateServeFile(json, Object.assign(option, { path, headerInfo, typeFileName, custom }));
      // 格式化
      lint && (await eslintServe(path));
    } catch (e: any) {
      console.log(`[Swagger2TSServe]: ${e.message}`);
    }
  };
  return { run };
};
