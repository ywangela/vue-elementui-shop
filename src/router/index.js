import Vue from 'vue'
import VueRouter from 'vue-router'


// 路由懒加载
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/components/user/Users')

const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')

const Cate= () => import('@/components/goods/Cate')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const addGood =  () => import('@/components/goods/addGood')

const Order = () => import('@/components/order/Order')

Vue.use(VueRouter)

const routes = [
  // 只要访问根路径，就重定向到login页面
  {
   path:'/',
   redirect: '/login'
  },
 {
   path:'/login',
   component:Login
 },

 {
  path:'/home',
  component:Home,        // 因为home页有很多路由（对应的组件）所以需要重定向到一个具体的
  // redirect: '/welcome', //只要你访问了home页，就自动重定向到/welcome
  children:[
    {
      path:'',
      redirect: '/welcome'
    },
    {
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/users',
      component:Users
    },
    {
      path:'/rights',
      component:Rights
    },
    {
      path:'/roles',
      component:Roles
    },
    {
      path:'/categories',
      component:Cate
    },
    {
      path:'/params',
      component:Params
    },
    {
      path:'/goods',
      component:List
    },
    {
      path:'/goods/add',
      component:addGood
    },
    {
      path:'/orders',
      component:Order
    }
  ]
}
]

const router = new VueRouter({
  routes,
  mode:'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径(url路径地址)
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行  next()直接放行  next('/login') 强制跳转
   
  if(to.path === '/login') {
    next()
  }else { // 如果是其他页面的话
    // 首先，判断有无token，即有无访问权限
    const token = window.sessionStorage.getItem('token');
    // 表示token不存在，即你没有登录，则无访问权限
    if(!token){
      next('/login')
    }else {
      next()
    }

  }
  
  // console.log(to)

 })




export default router
