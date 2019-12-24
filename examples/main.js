import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import KBoneUI from '../src/'

Vue.config.productionTip = false

sync(store, router)

Vue.use(KBoneUI)

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
