import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import { registerIpcRenderer } from '@/ipc/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css'
import '@/styles/index.scss'
import '@/assets/iconfont/iconfont'
registerIpcRenderer()

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'medium' })

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
