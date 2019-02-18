import Vue from 'vue'
import Router from 'vue-router'
import Member from '@/components/member'
import List from '@/components/list'
import Card from '@/components/card'
import Phone from '@/components/phone'
import Recharge from '@/components/recharge'
import rechargeSuccess from '@/components/rechargeSuccess'
import payItem from '@/components/payItem'

Vue.use(Router)

export default new Router({
	/*mode: 'history',*/
	base: '/zst-wap/wx-public/',
  routes: [
    {
      path: '/',
      name: 'Member',
      component: Member
    },
    {
      path: '/List',
      name: 'List',
      component: List
    },
    {
      path: '/Card',
      name: 'Card',
      component: Card
    },
    {
      path: '/Phone',
      name: 'Phone',
      component: Phone
    },
    {
      path: '/Recharge',
      name: 'Recharge',
      component: Recharge
    },
    {
      path: '/rechargeSuccess',
      name: 'rechargeSuccess',
      component: rechargeSuccess
    },
    {
      path: '/payItem',
      name: 'payItem',
      component: payItem
    },
  ]
})
