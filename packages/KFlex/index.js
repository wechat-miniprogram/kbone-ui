import KFlex from './KFlex.vue'
import KFlexItem from './KFlexItem.vue'

KFlex.install = function(Vue) {
    Vue.component(KFlex.name, KFlex)
};

KFlexItem.install = function(Vue) {
    Vue.component(KFlexItem.name, KFlexItem)
};

export {
    KFlexItem,
    KFlex
}