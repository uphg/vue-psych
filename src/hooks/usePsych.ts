import { inject } from "vue"
import { hasPsychProviderKey, psychProviderKey } from "../shared/provider"
import type { Psych } from './useProviderPsych'

export function usePsych(): Psych {
  const hasPsych = inject(hasPsychProviderKey, false)
  if (hasPsych) return inject<Psych>(psychProviderKey)!

  throw Error(`[VPsych] Cannot get Psych instance. Make sure useProviderPsych is running in the upper component of usePsych!`)
}
