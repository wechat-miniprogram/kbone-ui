import KToast from './KToast.vue'

KToast.install = function(Vue){
    Vue.component(KToast.name, KToast)
}

export default KToast