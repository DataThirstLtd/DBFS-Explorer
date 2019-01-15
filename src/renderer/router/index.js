import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Auth from '@/components/Auth'
import Home from '@/components/Home'

const { platform } = require('os')

Vue.use(Router)
Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: '#000000',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})

Vue.prototype.$platform = platform()

export default new Router({
  routes: [
    {
      path: '/',
      name: 'auth',
      component: Auth
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
