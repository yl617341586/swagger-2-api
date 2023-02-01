const { readdirSync } = require('fs');
const { resolve } = require('path');
const { cwd } = require('process');
module.exports = json => {
  try {
    readdirSync(resolve(cwd(), 'src', 'api'));
  } catch (e) {
    throw new Error(
      `[Api2ServeWebpackPlugin]: ${resolve(cwd(), 'src')} 路径下不存在api目录，请创建。`,
    );
  }
};
