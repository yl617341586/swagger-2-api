/*
 * @date: 2023/8/22 19:24:28
 * @description: 博客相关代码
 */

import { CreateBlogResDto, Blogs, PrivateBlogs, DetailBlogDto } from './type';

import { getData, postData, putData } from '@/fetch';

/**
 * 获取博客列表
 * @param {string} page 页码
 * @param {string} size 每页数量
 */
export const BlogController_list = (page: string, size: string) =>
  getData(`/blog/list`, Object.assign({ page, size }));

/**
 * 获取博客列表post
 * @param {string} page 页码
 * @param {string} size 每页数量
 * @param {"lew" | "as"} name hahahah
 */
export const BlogController_postList = (page: string, size: string, name: 'lew' | 'as') =>
  postData(`/blog/list`, Object.assign({ page, size, name }));

/**
 * 获取个人博客列表 需要登录
 * @param {string} uid 用户id
 * @param {string} page 页码
 * @param {string} size 每页数量
 */
export const BlogController_ownList = (uid: string, page: string, size: string) =>
  getData(`/blog/${uid}/list`, Object.assign({ page, size }));

/**
 * 获取博客详情
 * @param {string} id
 */
export const BlogController_detail = (id: string) => getData(`/blog/detail`, Object.assign({ id }));

/**
 * 获取个人博客详情
 * @param {string} uid 用户ID
 * @param {string} id 博客ID
 */
export const BlogController_ownDetail = (uid: string, id: string) =>
  getData(`/blog/${uid}/detail`, Object.assign({ id }));

/**
 * 发布博客
 * @param {string} id 博客ID
 */
export const BlogController_publish = (id: string) =>
  putData(`/blog/${id}/publish`, Object.assign({}));
