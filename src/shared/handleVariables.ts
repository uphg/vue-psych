import { isFunction } from "./isFunction"
import { isObject } from "./isObject"

export function handleVariables(data: Record<string, any>) {
  if (!data) return data
  const result: Record<string, any> = {}
  const keys = Object.keys(data)
  for (const key of keys) {
    if (isFunction(data[key])) {
      result[key] = data[key]()
    } else if (isObject(data[key])) {
      result[key] = handleVariables(data[key])
    } else {
      result[key] = data[key]
    }
  }
  return result
}
