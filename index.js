/*****************************/
/**   Chandler - The Docs.  **/
/**-------------------------**/
/**     Powered By Vue      **/
/**-------------------------**/
/*****************************/

import Vue from 'vue'

import Splash from './pages/Splash.vue'
import Guides from './pages/Guides.vue'
import CmdRef from './pages/CmdRef.vue'

const pages = {
  '/' :        Splash,
  '/guides':   Guides,
  '/commands': CmdRef
}

new Vue({
  el:       '#app',
  data:     { onPage: window.location.pathname  },
  computed: { getPage() { return pages[this.onPage] || pages['/'] } },
  render(h) { return h(this.getPage) }
})