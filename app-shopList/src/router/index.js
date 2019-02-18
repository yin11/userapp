
import Vue from 'vue'
import Router from 'vue-router'
import list from '@/components/list'
import search from '@/components/search'

Vue.use(Router)

export default new Router({
	/*mode: 'history',
	base: '/zst-wap/partnerCenter/',*/
  	routes: [
	    {
	      path: '/',
	      name: 'list',
	      component: list ,
	      meta :{
	      	title : '话呗特惠区'
	      }
	    },
	    {
	      path: '/search',
	      name: 'search',
	      component: search ,
	      meta :{
	      	title : '搜索页'
	      }
	    },
  	]
})
