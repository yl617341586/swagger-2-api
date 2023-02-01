import http from 'http';
import { Swagger } from 'swagger-2-ts-file/lib/swagger';
export default (path: string) =>
  new Promise<Swagger>((resolve, reject) => {
    http.get(path, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.status > 399) reject(new Error(`${json.status} ${json.error}`));
        else resolve(json);
      });
    });
  });
