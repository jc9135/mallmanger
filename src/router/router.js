import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')
// import Users from '../components/Users/Users'
const Users = () => import(/* webpackChunkName: "users_goods_categories" */ '../components/Users/Users')
// import Goods from '../components/Goods/Goods'
const Goods = () => import(/* webpackChunkName: "users_goods_categories" */ '../components/Goods/Goods')
// import Categories from '../components/Goods/Categories'
const Categories = () => import(/* webpackChunkName: "users_goods_categories" */ '../components/Goods/Categories')
// import Params from '../components/Goods/Params'
const Params = () => import(/* webpackChunkName: "params_reports_orders" */ '../components/Goods/Params')
// import Reports from '../components/Reports/Reports'
const Reports = () => import(/* webpackChunkName: "params_reports_orders" */ '../components/Reports/Reports')
// import Orders from '../components/Orders/Orders'
const Orders = () => import(/* webpackChunkName: "params_reports_orders" */ '../components/Orders/Orders')
// import Rights from '../components/Roles/Rights'
const Rights = () => import(/* webpackChunkName: "rights_roles_add" */ '../components/Roles/Rights')
// import Roles from '../components/Roles/Roles'
const Roles = () => import(/* webpackChunkName: "rights_roles_add" */ '../components/Roles/Roles')
// import Add from '../components/Goods/Add.vue'
const Add = () => import(/* webpackChunkName: "rights_roles_add" */ '../components/Goods/Add.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome', children: [
      {
        path: '/welcome', component: Welcome
      },{
        path: '/goods', component: Goods
      },{
        path: '/categories', component: Categories
      },{
        path: '/params', component: Params
      },{
        path: '/goods/add', component: Add
      },{
        path: '/reports', component: Reports
      },{
        path: '/orders', component: Orders
      },{
        path: '/rights', component: Rights
      },{
        path: '/roles', component: Roles
      },{
        path: '/users', component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
