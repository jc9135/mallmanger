import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import axios from 'axios'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条的包和样式
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.component('tree-table',ZkTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 添加请求拦截器,在请求拦截器展示进度条 Nprogress.start()
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器，在响应拦截器关闭进度条  Nprogress.done()
axios.interceptors.response.use(function (config) {
  // 在发送请求之后做些什么
  Nprogress.done()
  return config;
});
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
