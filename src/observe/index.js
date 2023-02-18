import {newArrayProto} from "./array";

class Observer {
  constructor(data) {
    data.__ob__ = this
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    if (Array.isArray(data)) {
      // 修改数组方法
      data.__proto__ = newArrayProto
      this.observeArray(data) // 数组中的对象
    } else {
      this.walk(data)
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }

  observeArray(data) {
    data.forEach(item => observe(item))
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
      observe(newValue)
      valve = newValue
    }
  })

}

export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== 'object' || data === null) {
    return
  }

  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }
   return new Observer(data)
}
