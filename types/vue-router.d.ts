export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number;
    // title
    title: string;
    // dynamic router level.
    dynamicLevel?: number;
    // dynamic router real route path (For performance).
    realPath?: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    // role info
    roles?: string[];
    // Whether not to cache
    ignoreKeepAlive?: boolean;
    // Is it fixed on tab
    affix?: boolean;
    // icon on tab
    icon?: string;
    // img on tab
    img?: string;
    frameSrc?: string;
    // current page transition
    transitionName?: string;
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;
    // Hide submenu
    hideChildrenInMenu?: boolean;
    // Carrying parameters
    carryParam?: boolean;
    // Used internally to mark single-level menus
    single?: boolean;
    // Currently active menu
    currentActiveMenu?: string;
    // Never show in tab
    hideTab?: boolean;
    // Never show in menu
    hideMenu?: boolean;
    isLink?: boolean;
    // only build for Menu
    ignoreRoute?: boolean;
    // Hide path for children
    hidePathForChildren?: boolean;
  }
}

/**
 * 路由元数据
 */
export interface Meta extends RouteMeta {
  /** 标题 */
  title: string;
  /** 图标 */
  icon?: string;
  /** 是否隐藏 */
  hide?: boolean;
  /** 外链地址 */
  href?: string;
  /** 是否缓存 */
  keepAlive?: boolean;
}

/**
 * 路由项
 */
export interface RouteItem {
  /** 路由名称 */
  name: string;
  /** 路由路径 */
  path: string;
  /** 元数据 */
  meta?: Meta;
  /** 组件路径 */
  component?: string;
  /** 重定向地址 */
  redirect?: string;
  /** 子路由 */
  children?: RouteItem[];
}
