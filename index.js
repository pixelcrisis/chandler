/*****************************/
/**   Chandler - The Docs.  **/
/**-------------------------**/
/**     Powered By Vue      **/
/**-------------------------**/
/*****************************/

import Vue from 'vue'
import VueRouter from 'vue-router'

import App    from './App.vue'
import Splash from './pages/Splash.vue'
import Guides from './pages/Guides.vue'
import CmdRef from './pages/CmdRef.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/',       component: Splash },
  { path: '/cmds',   component: CmdRef },
  { path: '/guides', component: Guides },
  { path: '*',       component: Splash }
]
const router = new VueRouter({ routes })

new Vue({
  el:       '#app',
  render(h) { return h(App) },
  router
})