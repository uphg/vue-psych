type Key = string | number | symbol

const keys = Object.keys

export function each<T>(
  object: T[] | Record<Key, T>,
  callback: (item: T, inedx: number | string, object: T[] | Record<Key, T>) => void
) {
  if (Array.isArray(object)) {
    let index = -1
    const length = object.length as number
    while (++index < length) {
      callback((object as T[])[index], index, object)
    }
  } else {
    let index = -1
    const propNames = keys(object)
    const length = keys.length
    while (++index < length) {
      const key = propNames[index]
      callback((object as Record<Key, T>)[key], key, object)
    }
  }
}
