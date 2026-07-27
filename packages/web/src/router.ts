import type { ComputedRef, InjectionKey } from "vue";
import { inject } from "vue";

export interface InkRouter {
  /** 当前路径（响应式） */
  currentPath: ComputedRef<string>;
  /** 当前页面名称 */
  currentName: ComputedRef<string | null>;
}

export const INK_ROUTER_KEY: InjectionKey<InkRouter> = Symbol("INK_ROUTER");

export function useOptionalRouter(): InkRouter | null {
  return inject(INK_ROUTER_KEY, null);
}
