import { generateTypeFile } from 'swagger-2-ts-file';
import { Swagger } from 'swagger-2-ts-file/lib/swagger';
import { resolve } from 'path';
import { cwd } from 'process';
import getSwaggerJson from './utils/get-swagger-json';
import generateServeFile from './utils/generate-serve-file';
import { FetchMap, TopInfo } from './swagger';
import eslintServe from './utils/eslint-serve';

export default (options: { excludeParam: Array<string>; fetchMap: FetchMap }) => {
  const run = async (
    swagger: Swagger | string,
    {
      path,
      typeFileName,
      lint,
      topInfo,
    }: { path?: string; typeFileName?: string; lint?: boolean; topInfo?: TopInfo } = {},
  ) => {
    const outputDir = resolve(cwd(), path?.replace(/^\//g, '') ?? './');
    const typeFilePath = resolve(outputDir, typeFileName ?? 'type.ts');
    try {
      let json: Swagger;
      try {
        if (typeof swagger === 'string' && new RegExp(/^http(|s):/).test(swagger))
          json = await getSwaggerJson(swagger);
        else if (typeof swagger !== 'string') json = swagger;
        else throw new Error('swagger格式不符合规范，请传入一个可访问url，或者swagger json对象。');
      } catch (e: any) {
        throw new Error(`Swagger数据初始化失败。失败原因：${e.message}`);
      }
      // 生成类型文件
      await generateTypeFile(json, typeFilePath);
      // 生成服务文件
      generateServeFile(json, { output: outputDir, fetchMap: options.fetchMap, topInfo });
      // 格式化
      lint && (await eslintServe(outputDir));
    } catch (e: any) {
      console.log(`[Swagger2TSServe]: ${e.message}`);
    }
  };
  return { run };
};
