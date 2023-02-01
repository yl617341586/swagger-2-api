module.exports = content => {
  const date = new Date();
  return `/*
 * @author: Lew
 * @e-mail: yaol@jiguang.cn
 * @date: ${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
 * @description: ${content}
 */

`;
};
