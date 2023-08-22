import http from 'http';
import { OpenApi } from 'swagger-2-ts-file/lib/openapi';
export default (path: string) =>
  new Promise<OpenApi>((resolve, reject) => {
    http
      .get(path, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          const json = JSON.parse(data);
          if (json.status > 399) reject(new Error(`${json.status} ${json.error}`));
          else resolve(json);
        });
      })
      .on('error', err => {
        reject(new Error(`请求数据失败，${err.message}`));
      });
  });
