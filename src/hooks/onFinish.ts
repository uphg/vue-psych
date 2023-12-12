import { finishProviderKey } from "../shared/provider"
import { inject, type Ref } from "vue"

export function onFinish<T extends Function>(fn: T) {
  const finish = inject<Ref<Function | null>>(finishProviderKey)
  if (finish) {
    finish.value = fn
  }
}