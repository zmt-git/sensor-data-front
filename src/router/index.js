import Vue from 'vue'
import Router from 'vue-router'
import { setupRouter } from './guard/index'
import routes from './routes/index'

Vue.use(Router)
const router = new Router({
  routes: routes
})

setupRouter(router)

export default router
