import { Swagger } from 'swagger-2-ts-file/lib/swagger';
import { FetchMap, TopInfo } from '../swagger';
import generateTopFragment from './generate-top-fragment';
import generateTypeImports from './generate-type-imports';
import { writeFileSync, access, constants, mkdirSync, readdirSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
export default (
  swagger: Swagger,
  { output, topInfo }: { output?: string; fetchMap?: FetchMap; topInfo?: TopInfo },
) => {
  const path = output ? output : resolve(cwd());
  const serveFils = readdirSync(path);
  swagger.tags.forEach(({ name, description }) => {
    const fileName = `${name}.ts`;
    if (serveFils.includes(fileName)) return;
    // const topFragment = generateTopFragment(description, topInfo?.author, topInfo?.mail);
    const _import = generateTypeImports(name, swagger);
    console.log('_import', _import);
    // writeFileSync(resolve(fileName), '');
    //   writeFileSync(
    //     resolve(servePath, `${name.replace(/\//g, '-')}.ts`),
    //     `${generateHeaderFragment(description)}${generateImport(name, json, typeFileName)};
    //     ${fetchMap ? generateFetch(name, json, fetchMap) : ''}`,
    //     {
    //       encoding: 'utf-8',
    //     },
    //   );
  });
};
