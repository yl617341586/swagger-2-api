export interface InitOption {
  /** 生成的文件类型，分为 ts｜js 两种。 */
  mode: 'js' | 'ts';
  /**
   * 排除的参数，有的参数在请求时统一添加，不需要在每个方法的参数中传入。
   * @example ['Locale', 'Authorization']
   */
  excludeParams?: Array<string>;
}

export interface RunOptions {
  /** 文件生成的dir路径，默认是/api文件夹 */
  path?: string;
  /**类型文件的名称， mode为js时此属性无效 */
  typeFileName?: string;
  /** 是否启动自动格式化 */
  lint?: boolean;
  /** 文件的顶部信息 */
  headerInfo?: HeaderInfo;
  /** 自定义生成请求方法 */
  custom?: (entity: ServeEntity) => { name: string; path: string; content: string };
}
export interface HeaderInfo {
  /** 生成文件的用户 */
  author?: string;
  /** 生成文件的邮箱 */
  email?: string;
}

export interface GenerateServeFileOptions extends InitOption {
  /** 文件生成的dir路径，默认是/api文件夹 */
  path: string;
  /** 文件的顶部信息 */
  headerInfo?: HeaderInfo;
  /**类型文件的名称， mode为js时此属性无效 */
  typeFileName: string;
  /** 自定义生成请求方法 */
  custom: (entity: ServeEntity) => { name: string; path: string; content: string };
}

export interface FetchMap {
  get: string;
  post: string;
  put: string;
  delete: string;
}
