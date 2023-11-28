interface EmitterCallback {
  (...args: unknown[]): unknown
  _?: (...args: unknown[]) => unknown
}

export class Emitter {
  public events: { [key: string]: EmitterCallback[] } = {}
  on(name: string, callback: EmitterCallback) {
    const e = this.events
    e[name] = e[name] || []
    e[name]?.push(callback)
  }

  once(name: string, callback: EmitterCallback) {
    const listener = (...args: unknown[]) => {
      this.off(name, listener);
      callback(...args);
    }

    // record the original function
    listener._ = callback
    return this.on(name, listener)
  }

  emit(name: string, ...args: unknown[]) {
    const e = this.events
    if (!e[name]) return

    for (const callback of e[name]) {
      callback(...args)
    }
  }

  off(name: string, callback?: EmitterCallback) {
    const e = this.events
    if (!e[name]?.length) return
    
    if (callback) {
      const newCache = []
      for (const item of e[name]) {
        if (item === callback || item._ === callback) continue
        item && newCache.push(item)
      }
      e[name] = newCache
    } else {
      delete e[name]
    }
  }

  clear() {
    this.events = {}
  }
}

export const useEmitter = () => new Emitter()

export default Emitter