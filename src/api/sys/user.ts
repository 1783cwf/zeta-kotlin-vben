import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { CaptchaResult, LoginParam, LoginResult, UserMenu } from '@/api/sys/model/login';
import { UserInfo } from '#/store';
import { PageParam, PageResult } from '#/base';
import { SysUser } from '#/sys/user';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/system/user/info',
  GetPermCode = '/system/user/permissions',
  TestRetry = '/testRetry',
  Captcha = '/captcha',
  GetUserMenu = '/system/user/menu',
  Page = '/system/user/page',
  Query = '/system/user/query',
  Common = '/system/user',
  Batch = '/system/user/batch',
  ChangePwd = '/system/user/changePwd',
  RestPwd = '/system/user/restPwd',
  UpdateState = '/system/user/state',
  Existence = '/system/user/existence',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResult>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取验证码
 * @returns
 */
export function captchaApi() {
  return defHttp.get<CaptchaResult>(
    { url: Api.Captcha },
    {
      withToken: false,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<UserInfo>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function pageUserApi(params: PageParam<SysUser>) {
  return defHttp.post<PageResult<SysUser>>({ url: Api.Page, params });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

/**
 * 获取当前用户菜单
 * @returns
 */
export function getUserMenuApi() {
  return defHttp.get<UserMenu[]>({ url: Api.GetUserMenu });
}

// export function pageUserApi(params: )

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
