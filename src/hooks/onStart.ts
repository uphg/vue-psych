import { startProviderKey } from "../shared/provider"
import { inject, type Ref } from "vue"

export function onStart<T extends Function>(fn: T) {
  const start = inject<Ref<Function | null>>(startProviderKey)
  if (start) {
    start.value = fn
  }
}
