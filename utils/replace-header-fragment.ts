import { readFileSync, writeFileSync } from 'fs';

export default (path: string, headerFragment: string) => {
  const data = readFileSync(path, 'utf8') ?? '';
  const regex = new RegExp(/\/\*[\s\S]+?\*\//, 'g');
  writeFileSync(path, data.replace(data.match(regex)?.[0] ?? '', headerFragment), {
    encoding: 'utf-8',
  });
};
