import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main
    }
  ]
})
