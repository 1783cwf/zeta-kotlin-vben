import type {
  ComponentRenderProxy,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType,
} from 'vue';

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  // fix FullScreen type error
  interface Document {
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  declare interface ViteEnv {
    VITE_USE_MOCK: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}

/**
 * 通用返回结果
 */
export interface ApiResult<T> {
  /** 编码 */
  code: number;
  /** 是否操作成功。 code != 0 代表操作失败 */
  success: boolean;
  /** 返回信息 */
  message?: string;
  /** 返回数据 */
  data?: T;
  /** 错误描述 */
  error?: string;
}

/**
 * 分页查询返回结果
 */
export interface PageResult<T> {
  /** 当前页数据 */
  list?: T[];
  /** 总数量 */
  count?: string | number;
}

/**
 * token信息
 */
export interface TokenInfo {
  /** token */
  token: string;
  /** token名称 */
  tokenName: string;
}

/**
 * 分页查询参数
 */
export interface PageParam<T> {
  /** 当前页 */
  page?: number;
  /** 每页显示条数 */
  limit?: number;
  /** 查询条件 */
  model?: T;
  /** 排序字段 支持驼峰、下划线 */
  sort?: string;
  /** 排序规则 */
  order?: 'desc' | 'asc';
}

/**
 * 验证存在参数
 *
 * 说明：
 *
 * 新增用户的时候，验证用户名(username)的值(张三)是否被人使用了
 * ```
 * {"field": "username",  "value": "张三"}
 * ```
 * 修改用户的时候，验证用户名(username)的值(李四)是否被除了当前用户id(2011214167781)的人使用了
 * ```
 * {"field": "username",  "value": "李四",  "id": "2011214167781"}
 * ```
 */
export interface ExistParam<T> {
  /** 检查的字段名 */
  field: string;
  /** 检查的字段值 */
  value: string;
  /** 主键字段的值  修改时用到 */
  id?: T;
}

/**
 * 修改状态参数
 */
export interface UpdateStateParam<T, U> {
  /** 主键 */
  id: T;
  /** 状态 */
  state: U;
}
