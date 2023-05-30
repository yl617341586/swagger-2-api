export default (content = '', author = '', mail = '') => {
  const date = new Date();
  return `/*
 ${author ? `* @author: ${author}` : ''}
 ${mail ? `* @e-mail: ${mail}` : ''}
 * @date: ${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
 * @description: ${content}
 */

`.replace(/\s\n/g, '');
};
