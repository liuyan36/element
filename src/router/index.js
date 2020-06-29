import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// eslint-disable-next-line no-use-before-define
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从什么路径跳转而来
  // next 是一个函数，放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
  //  在判断不是登录而是直接进入的话，会强制将切换的页面返回login
})

export default router
