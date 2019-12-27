import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()//产生页面进度条
  if (getToken()) {//cooking中存在token
    if (to.path === '/login') {
      next({ path: '/' }) //直接访问首页
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      console.log(store.getters.roles)
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            console.log(err)
            Message.error('拉取用户信息失败')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { //没有token 并且要跳转的路由是/login
      next() //放行请求
    } else {
      next('/login')// 要跳转的路由不是/login 重新跳到/login页面
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
