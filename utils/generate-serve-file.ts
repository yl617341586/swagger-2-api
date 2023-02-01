import { Swagger } from 'swagger-2-ts-file/lib/swagger';
import { FetchMap } from '../swagger';
import { writeFileSync, access, constants, mkdirSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';

export default (json: Swagger, output?: string, fetchMap?: FetchMap) => {
  const path = output ? output : resolve(cwd());
  console.log(path);
  // const servePath = resolve(cwd(), 'src', 'api');
  // const dirs = readdirSync(servePath);
  // json.tags.forEach(({ name, description }) => {
  //   if (!dirs.includes(`${name.replace(/\//g, '-')}.ts`))
  //     writeFileSync(
  //       resolve(servePath, `${name.replace(/\//g, '-')}.ts`),
  //       `${generateHeaderFragment(description)}${generateImport(name, json, typeFileName)};
  //       ${fetchMap ? generateFetch(name, json, fetchMap) : ''}`,
  //       {
  //         encoding: 'utf-8',
  //       },
  //     );
  // });
};
