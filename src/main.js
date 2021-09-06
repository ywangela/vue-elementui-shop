import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 树状表格中用到的插件
import TreeTable from 'vue-table-with-tree-grid'


// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// axios的配置
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在axios挂载到原型之前，先设置一下请求拦截器  ！！！
// config是请求对象
axios.interceptors.request.use(config => {
  // console.log(config) //初始config请求对象
  
  //  在return之前，对config请求对象做一些预处理
  config.headers.Authorization = sessionStorage.getItem('token')
   
  // 在最后的时候，必须return config （新的config）
  return config
})

Vue.prototype.$http = axios;




Vue.config.productionTip = false

// element-ul
Vue.use(ElementUI)

// 树状表格插件注册
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
