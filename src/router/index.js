import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/*webpackChunkName: "Login_home_welcome"*/ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/*webpackChunkName: "Login_home_welcome"*/ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/*webpackChunkName: "Login_home_welcome"*/ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/*webpackChunkName: "Users_Rights_Roles"*/ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/*webpackChunkName: "Users_Rights_Roles"*/ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/*webpackChunkName: "Users_Rights_Roles"*/ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/*webpackChunkName: "Cate_Params"*/ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/*webpackChunkName: "Cate_Params"*/ '../components/goods/Params.vue')

// import GoodsList from '../components/goods/GoodsList.vue'
const GoodsList = () => import(/*webpackChunkName: "GoodsList_Add"*/ '../components/goods/GoodsList.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/*webpackChunkName: "GoodsList_Add"*/ '../components/goods/Add.vue')

// import Orders from '../components/orders/orders.vue'
const Orders = () => import(/*webpackChunkName: "Orders_Repost"*/ '../components/orders/orders.vue')
// import Repost from '../components/repost/Repost.vue'
const Repost = () => import(/*webpackChunkName: "Orders_Repost"*/ '../components/repost/Repost.vue')

// 解决路由重复报错问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Repost
      }
    ]
  },
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
