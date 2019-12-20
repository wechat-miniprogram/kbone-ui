import KView from './KView.vue'

KView.install = function(Vue) {
    Vue.component(KView.name, KView)
};

export default KView