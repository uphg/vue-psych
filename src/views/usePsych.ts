import { provide, ref } from "vue";

export function usePsych() {
  const psych = ref({ name: 'abc' })
  provide('abc', psych)
  return psych
}