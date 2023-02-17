
class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }

}

export function defineReactive(target, key, valve) {
  observe(valve) // 递归劫持
  Object.defineProperty(target, key, {
    get() {
      return valve
    },
    set(newValue) {
      if (newValue === valve) return
      valve = newValue
    }
  })

}

export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== 'object' || data === null) {
    return
  }
   return new Observer(data)
}
