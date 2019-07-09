import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { plugin as VueFunction } from 'vue-function-api'

Vue.use(VueFunction)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
