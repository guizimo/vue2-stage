import {initState} from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 获取配置
    const vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)
  }
}
