import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import evaluate from '@/components/evaluate'
import order from '@/components/order'
import paySuccess from '@/components/paySuccess'
import ApplyRefund from '@/components/ApplyRefund'

Vue.use(Router)

export default new Router({
	/*mode: 'history',
	base: '/zst-wap/app-shop',*/
	routes: [
	    {
	      path: '/',
	      name: 'index',
	      component: index
	    },
	    {
	      path: '/evaluate',
	      name: 'evaluate',
	      component: evaluate
	    },
	    {
	      path: '/order',
	      name: 'order',
	      component: order
	    },
	    {
	      path: '/paySuccess',
	      name: 'paySuccess',
	      component: paySuccess
	    },
	    {
	      path: '/ApplyRefund',
	      name: 'ApplyRefund',
	      component: ApplyRefund
	    },
	]
})
