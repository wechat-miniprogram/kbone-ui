import KSwiper from './KSwiper.vue'
import KSwiperItem from './KSwiperItem.vue'

KSwiper.install = function(Vue){
    Vue.component(KSwiper.name, KSwiper)
}

KSwiperItem.install = function(Vue){
    Vue.component(KSwiperItem.name, KSwiperItem)
}


export {
    KSwiper,
    KSwiperItem
}