import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/logo.css'

// 导入图标样式表
import './assets/css/fonts/iconfont.css'

// 配置axios请求发送
import axios from 'axios'
// 配置请求的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 挂载到全局的请求axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
