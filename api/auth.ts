/*
 * @date: 2023/8/22 19:24:28
 * @description: 校验相关代码
 */

import { RegisterResponseDto, CreateUserDto, LoginResponseDto, LoginUserDto } from './type';

import { postData } from '@/fetch';

/**
 *
 * @param {LoginUserDto} body
 */
export const AuthController_login = (body: LoginUserDto) =>
  postData(`/auth/login`, Object.assign({}, body));
