import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 树状表格中用到的插件
import TreeTable from 'vue-table-with-tree-grid'


// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


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

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)


// 配置一个全局的时间过滤器 将时间戳转成格式化的时间 每个组件都可以调用
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  
  // 获取年、月、日
  const y = dt.getFullYear()
  // 不足2位的，用0补充  padStart()是字符串补全方法
  const m = (dt.getMonth()+1 +'').padStart(2,'0')
  const d = (dt.getDate() +'').padStart(2,'0')


  // 获取时、分、秒
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm= (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
