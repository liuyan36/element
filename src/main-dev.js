import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import './plugins/element.js'
import 'default-passive-events'

// 导入全局样式表
import './assets/css/logo.css'

// 导入图标样式表
import './assets/css/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入这个包的js和css
import Nprogress from 'nprogress'

// 配置axios请求发送
import axios from 'axios'
// 配置请求的路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置axios拦截器
axios.interceptors.request.use(config => {
  // 在request拦截器中展示进度条，Nprogress.start()
    Nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须要return config
  return config
})
// 在拦截器中隐藏进度条 Nprogerss.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

// 挂载到全局的请求axios
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 全局定义格式化时间过滤器,叫做dateFormat
Vue.filter('dateFormat', function(originVal){
  const dt = new Date(originVal)

  // y 年 m 月 d 日 hh小时 mm分钟 ss 秒
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
