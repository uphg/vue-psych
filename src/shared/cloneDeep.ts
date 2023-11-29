import { isFunction } from "./isFunction"

type BaseType = string | number | boolean | null | undefined | bigint | symbol

export function cloneDeep(value: any) {
  return baseCloneDeep(value)
}

function baseCloneDeep<T extends BaseType | object>(value: T, cache = new WeakMap()): T | Object | Array<unknown> | Date | RegExp {
  if (!isObject<Record<string, any>>(value) || isFunction(value)) return value 
  if (cache.has(value)) return cache.get(value)

  let result: RegExp | Date | Array<unknown> | Record<string, any>
  const tag = getTag(value)
  if (tag === '[object RegExp]') {
    result = new RegExp((value as RegExp).source, (value as RegExp).flags)
  } else if (tag === '[object Date]') {
    result = new Date((value as any) - 0)
  } else if (tag === '[object Array]') {
    result = []
  } else {
    result = {}
  }

  cache.set(value, result)

  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      const item = value[key];
      (result as Record<string, any>)[key] = baseCloneDeep(item, cache)
    }
  }

  return result
}

function isObject<T extends object>(value: unknown): value is T {
  return typeof value === 'object' && value !== null
}

function getTag(value: unknown): string {
  return Object.prototype.toString.call(value)
}
