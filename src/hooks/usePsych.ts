import { inject } from "vue"
import { hasPsychProviderKey, psychProviderKey } from "../shared/provider"
import type { Psych } from "./useProviderPsych"

/**
 * Get the current test object function.
 * @returns {object} Psych object, including common methods.
 * 
 * @example
 * const psych = usePsych()
 * psych.run([...])
 * psych.next()
 * psych.setData()
 * psych.getTrialNodes()
 */
export function usePsych() {
  const hasPsych = inject(hasPsychProviderKey, false)
  if (hasPsych) return inject<Psych>(psychProviderKey)!

  throw Error(`[VuePsych] Cannot get Psych instance. Make sure useProviderPsych is running in the upper component of usePsych!`)
}
