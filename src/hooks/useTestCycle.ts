import { provide, ref } from "vue"
import { finishProviderKey, startProviderKey } from "../shared/provider"

export function useTestCycle() {
  const start = ref<Function | null>(null)
  const finish = ref<Function | null>(null)

  provide(startProviderKey, start)
  provide(finishProviderKey, finish)
}