const api2Serve = require('../lib');
const swaggerJson = require('./swagger.json');

const { run } = api2Serve({
  excludeParam: ['Locale', 'AccountId'],
  fetchMap: { asd: 'asdas' },
  //   fetchMap: {
  //     get: { name: 'getData' },
  //     post: { name: 'postData' },
  //     delete: { name: 'deleteData' },
  //     put: { name: 'putData' },
  //   },
});
run('http://localhost:3001/api-json', { path: '/src', lint: true });
