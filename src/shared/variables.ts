import { isObject } from "./isObject"

export class TimelineVariables {
  key: string
  constructor(key: string) {
    this.key = key
  }
}

/**
 * Create variables object.
 * @param {string} [key] - The key in the corresponding timelineVariables object.
 * @returns {object} TimelineVariables object.
 * 
 * @example
 * const test = {
 *   data: {
 *     correctResponse: psych.variables('correctResponse')  
 *   }
 * }
 * 
 * const testProcedure = {
 *   timeline: [test],
 *   timeline_variables: [
 *     { correctResponse: 'f' }
 *   ]
 * }
 */
export function variables(key: string) {
  return new TimelineVariables(key)
}

export function isVariables(value: Record<string, any>) {
  return Object.getPrototypeOf(value) === TimelineVariables.prototype
}

export function handleVariables(data: Record<string, any>) {
  if (!data) return data
  const result: Record<string, any> = {}
  const keys = Object.keys(data)
  for (const key of keys) {
    if (isVariables(data[key])) {
      result[key] = data[key]()
    } else if (isObject(data[key])) {
      result[key] = handleVariables(data[key])
    } else {
      result[key] = data[key]
    }
  }
  return result
}
