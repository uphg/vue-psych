import type { PsychPluginHandler, TrialNode } from "../types"
import type { Psych } from '../hooks/useProviderPsych'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = true | string | string[] | KeyPredicate

/**
 * Keyboard response plugin.
 * @returns {object} Plugin object, containing plug-in loading/unloading functions.
 * 
 * @example
 * const welcome = {
 *   name: 'welcome',
 *   type: keyboardResponse,
 *   choices: [' '],
 *   data: {
 *     message: '欢迎参加本次实验，按空格键开始。'
 *   }
 * }
 * 
 * onMounted(() => {
 *   psych.run([welcome])
 * })
 */
export function keyboardResponse() {
  let predicate: KeyPredicate | undefined
  let handler: PsychPluginHandler | undefined | (() => void)

  function load(trial: Record<string, any>, psych: Psych, _handler?: PsychPluginHandler) {
    const keys = trial.parameters?.choices!
    predicate = createKeyPredicate(keys)
    handler = _handler ?? ((event) => {
      psych.trigger('keyboard', { key: event.key })
      psych.next()
    })
    document.addEventListener('keydown', listener)
  }

  function unload() {
    document.removeEventListener('keydown', listener)
  }

  function listener(event: KeyboardEvent) {
    if (event.repeat) { return }

    if (predicate?.(event)) {
      handler?.(event)
    }
  }

  return { load, unload }
}

function createKeyPredicate(keyFilter: KeyFilter): KeyPredicate {
  if (typeof keyFilter === 'function') {
    return keyFilter
  } else if (typeof keyFilter === 'string') {
    return (event: KeyboardEvent) => event.key === keyFilter
  } else if (Array.isArray(keyFilter)) {
    return (event: KeyboardEvent) => keyFilter.includes(event.key)
  }

  return () => true
}