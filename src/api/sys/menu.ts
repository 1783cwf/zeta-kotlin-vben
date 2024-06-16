import { defHttp } from '@/utils/http/axios';
import { SysMenu, SysMenuSaveParam } from '#/sys/menu';
import { ID } from '#/base';

enum Api {
  GetMenuList = '/system/menu/tree',
  Common = '/system/menu',
  Batch = '/system/menu/batch',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (param: SysMenu = {}) => {
  return defHttp.post<SysMenu>({ url: Api.GetMenuList, params: param });
};

/**
 * @description: Add menu
 * @param param
 */
export const addMenu = (param: SysMenuSaveParam) => {
  return defHttp.post<boolean>(
    { url: Api.Common, params: param },
    {
      errorMessageMode: 'modal',
    },
  );
};

export function menuInfo(menuId: ID) {
  return defHttp.get<SysMenu>({ url: Api.Common + '/' + menuId });
}

export const updateMenu = (param: SysMenuSaveParam) => {
  return defHttp.put<boolean>({ url: Api.Common, params: param });
};

export const deleteMenu = (id: string) => {
  return defHttp.delete<boolean>({ url: `${Api.Common}/${id}` });
};

export const batchDeleteMenuApi = (ids: string[]) => {
  return defHttp.delete<boolean>({ url: Api.Batch, params: ids });
};
