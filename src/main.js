import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// axios的配置
import axios from 'axios'



Vue.prototype.$http = axios;
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


Vue.config.productionTip = false

// element-ul
Vue.use(ElementUI)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
