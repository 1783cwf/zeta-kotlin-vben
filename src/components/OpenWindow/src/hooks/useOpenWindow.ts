import { useLocalStorage } from '@vueuse/core';
import { Opentype, OpenFuncInstance } from '../typing';

/**
 * 使用模态框/抽屉打开窗口
 * @param storageKey 保存在本地的key
 * @param defaultOpenType 默认打开方式 缓存在localStorage
 * @param openFunc
 * @returns
 */
export function useOpenType(
  storageKey: string,
  defaultOpenType: Opentype,
  openFunc: OpenFuncInstance,
) {
  let errMsg = '';
  const openTypes = ['modal', 'drawer'];
  const openType = useLocalStorage<Opentype>(storageKey, defaultOpenType);
  if (!openTypes.includes(openType.value)) {
    errMsg = '错误: 未指定打开窗口方式.';
    alert(errMsg);
    throw new Error(errMsg);
  }

  /**
   * 提取到一个函数
   * @param props
   * @param data
   * @param openOnSet
   */
  function openWindow<T = any>(props?: boolean, data?: T, openOnSet?: boolean) {
    openFunc[openType.value](props, data, openOnSet);
  }

  return {
    openType,
    openWindow,
  };
}
