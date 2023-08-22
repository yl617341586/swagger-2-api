import { Tag } from 'swagger-2-ts-file/lib/openapi';
import { HeaderInfo } from '../type';

export default (
  tags: Array<Tag> = [],
  localTags: Array<string>,
  { author, email }: HeaderInfo = {},
) => {
  const date = new Date();
  const description = tags.find(tag => localTags.includes(tag.name))?.description || '';
  return `/*
   ${author ? `* @author: ${author}` : ''}
   ${email ? `* @e-mail: ${email}` : ''}
   * @date: ${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
   ${description ? `* @description: ${description}` : ''}
   */
  `.replace(/\s\n/g, '');
};
