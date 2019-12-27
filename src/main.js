import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/icons' // svg-icon
import '@/styles/index.scss' // global css
import store from './store'
import '@/permission' // permission control

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
