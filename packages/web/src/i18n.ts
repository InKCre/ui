import type { InjectionKey, Ref } from "vue";
import { inject } from "vue";

export interface InkI18n {
  t: (key: string) => string;
  locale: Ref<string>;
}

export const INK_I18N_KEY: InjectionKey<InkI18n> = Symbol("INK_I18N");

export function useOptionalI18n(): InkI18n | null {
  return inject(INK_I18N_KEY, null);
}
