import Vue from 'vue'
import Router from 'vue-router'
import CommentSimple from '../components/comment-simple'
// import CommentOauth from '../components/comment-oauth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: CommentSimple
    },
    {
      path: '/CommentSimple',
      name: 'CommentSimple',
      component: CommentSimple
    },
    // {
    //   path: '/',
    //   name: 'CommentOauth',
    //   component: CommentOauth
    // }
  ]
})
