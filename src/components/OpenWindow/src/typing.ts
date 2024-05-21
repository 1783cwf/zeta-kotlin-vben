export type Opentype = 'drawer' | 'modal';
/** vben modal/drawer */
export type OpenFunc = <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void;

export interface OpenFuncInstance {
  modal: OpenFunc;
  drawer: OpenFunc;
}
