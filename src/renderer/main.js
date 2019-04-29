import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

const os = require('os')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$platform = os.platform()

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
