// 真实接口
import {
  Captcha,
  LoginFormData,
  LoginResponseData,
} from '@/types/api/system/login';
import { AxiosPromise } from 'axios';
import request from '@/api'

/**
 * 登录
 * @param data
 */
export function login(data: LoginFormData): AxiosPromise<LoginResponseData> {
  return request({
    url: '/api/login',
    method: 'post',
    params: data,
    headers: {
      Authorization: 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2', // 客户端信息Base64明文：mall-admin-web:123456
    },
  });
}

/**
 * 注销
 */
export function logout() {
  return request({
    url: '/api/logout',
    method: 'delete',
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<Captcha> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get',
  });
}
