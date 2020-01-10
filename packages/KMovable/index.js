import KMovableView from './KMovableView.vue'
import KMovableArea from './KMovableArea.vue'

KMovableView.install = function(Vue) {
    Vue.component(KMovableView.name, KMovableView)
}
KMovableArea.install = function(Vue) {
    Vue.component(KMovableArea.name, KMovableArea)
}

export {KMovableArea, KMovableView}
