import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import KBoneUI from '../src/'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false

sync(store, router)

Vue.use(KBoneUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
