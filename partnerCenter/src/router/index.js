import Vue from 'vue'
import Router from 'vue-router'

const index = r => require.ensure([], () => r(require('@/components/index')), 'index')
const putCash = r => require.ensure([], () => r(require('@/components/withdraw/putCash')), 'putCash')
const withdrawList = r => require.ensure([], () => r(require('@/components/withdraw/withdrawList')), 'withdrawList')
const partnerInfo = r => require.ensure([], () => r(require('@/components/info/partnerInfo')), 'partnerInfo')
const bindPhone  = r => require.ensure([], () => r(require('@/components/info/bindPhone')), 'bindPhone')
const profitList = r => require.ensure([], () => r(require('@/components/profitList')), 'profitList')


const newBusiness = r => require.ensure([], () => r(require('@/components/manage/newBusiness/newBusiness')), 'newBusiness')
const businessList = r => require.ensure([], () => r(require('@/components/manage/newBusiness/businessList')), 'businessList')
const detail = r => require.ensure([], () => r(require('@/components/manage/newBusiness/detail')), 'detail')
const storeMenberCount = r => require.ensure([], () => r(require('@/components/manage/newBusiness/storeMenberCount')), 'storeMenberCount')
const storeCardCount = r => require.ensure([], () => r(require('@/components/manage/newBusiness/storeCardCount')), 'storeCardCount')
const storeProfit = r => require.ensure([], () => r(require('@/components/manage/newBusiness/storeProfit')), 'storeProfit')
const buyCardDetai = r => require.ensure([], () => r(require('@/components/manage/newBusiness/buyCardDetail')), 'buyCardDetail')

const memberList = r => require.ensure([], () => r(require('@/components/manage/newMenber/memberList')), 'memberList')
const memberDetail = r => require.ensure([], () => r(require('@/components/manage/newMenber/memberDetail')), 'memberDetail')

const currentSaleCard = r => require.ensure([], () => r(require('@/components/manage/saleCard/currentSaleCard')), 'currentSaleCard')
const orderDetail = r => require.ensure([], () => r(require('@/components/manage/saleCard/orderDetail')), 'orderDetail')


const businessCount = r => require.ensure([], () => r(require('@/components/count/businessCount')), 'businessCount')
const menberCount = r => require.ensure([], () => r(require('@/components/count/menberCount')), 'menberCount')
const saleCard = r => require.ensure([], () => r(require('@/components/count/saleCard')), 'saleCard')
const saleCardDetail = r => require.ensure([], () => r(require('@/components/count/saleCardDetail')), 'saleCardDetail')


const staff = r => require.ensure([], () => r(require('@/components/tool/staff/staff')), 'staff')
const staffDetail = r => require.ensure([], () => r(require('@/components/tool/staff/staffDetail')), 'staffDetail')
const addStaff = r => require.ensure([], () => r(require('@/components/tool/staff/addStaff')), 'addStaff')
const stafHistory = r => require.ensure([], () => r(require('@/components/tool/staff/stafHistory')), 'stafHistory')


const buyCard = r => require.ensure([], () => r(require('@/components/tool/buyCard/buyCard')), 'buyCard')
const material = r => require.ensure([], () => r(require('@/components/tool/buyCard/material')), 'material')
const buyCardAddresss = r => require.ensure([], () => r(require('@/components/tool/buyCard/addresss')), 'buyCardAddresss')
const shopList = r => require.ensure([], () => r(require('@/components/tool/buyCard/shopList')), 'shopList')



const information = r => require.ensure([], () => r(require('@/components/tool/enter/information')), 'information')
const loginInfo = r => require.ensure([], () => r(require('@/components/tool/enter/loginInfo')), 'loginInfo')
const address = r => require.ensure([], () => r(require('@/components/tool/enter/address')), 'address')
const aptitude = r => require.ensure([], () => r(require('@/components/tool/enter/aptitude')), 'aptitude')
const receivables = r => require.ensure([], () => r(require('@/components/tool/enter/receivables')), 'receivables')
const preview = r => require.ensure([], () => r(require('@/components/tool/enter/preview')), 'preview')


const newMember = r => require.ensure([], () => r(require('@/components/chart/newMember')), 'newMember')
const profitCount = r => require.ensure([], () => r(require('@/components/chart/profitCount')), 'profitCount')


Vue.use(Router)

export default new Router({
	/*mode: 'history',
	base: '/zst-wap/partnerCenter',*/
  routes: [
    {
      path: '/',
      name: 'index',
      component: index ,
      meta :{
      	title : '服务商中心'
      }
    },
    {
      path: '/putCash',
      name: 'putCash',
      component: putCash ,
      meta :{
      	title : '提现'
      }
    },
    {
      path: '/withdrawList',
      name: 'withdrawList',
      component: withdrawList,
      meta :{
      	title : '提现记录'
      }
    },
    {
      path: '/partnerInfo',
      name: 'partnerInfo',
      component: partnerInfo,
      meta :{
      	title : '个人中心设置'
      }
    },
    {
      path: '/bindPhone',
      name: 'bindPhone',
      component: bindPhone,
      meta :{
      	title : '更改绑定手机号'
      }
    },
    {
      path: '/profitList',
      name: 'profitList',
      component: profitList,
      meta :{
      	title : '收益统计'
      }
    },
    {
      path: '/businessList',
      name: 'businessList',
      component: businessList,
      meta :{
      	title : '我推荐的联盟商家'
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail,
      meta :{
      	title : '联盟商家详情'
      }
    },
    {
      path: '/storeMenberCount',
      name: 'storeMenberCount',
      component: storeMenberCount,
      meta :{
      	title : '商家会员统计'
      }
    },
    {
      path: '/storeCardCount',
      name: 'storeCardCount',
      component: storeCardCount,
      meta :{
      	title : '商家购卡统计'
      }
    },
    {
      path: '/buyCardDetai',
      name: 'buyCardDetai',
      component: buyCardDetai,
      meta :{
      	title : '商家购卡明细'
      }
    },
    {
      path: '/storeProfit',
      name: 'storeProfit',
      component: storeProfit,
      meta :{
      	title : '商家收益统计'
      }
    },
    {
      path: '/saleCard',
      name: 'saleCard',
      component: saleCard,
      meta :{
      	title : '售卡统计'
      }
    },
    {
      path: '/newMember',
      name: 'newMember',
      component: newMember,
      meta :{
      	title : '新增会员'
      }
    },
    {
      path: '/newBusiness',
      name: 'newBusiness',
      component: newBusiness,
      meta :{
      	title : '新增商家'
      }
    },
    {
      path: '/currentSaleCard',
      name: 'currentSaleCard',
      component: currentSaleCard,
      meta :{
      	title : '本月售卡'
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail,
      meta :{
      	title : '订单购卡详情'
      }
    },
    {
      path: '/businessCount',
      name: 'businessCount',
      component: businessCount,
      meta :{
      	title : '商家统计'
      }
    },
    {
      path: '/menberCount',
      name: 'menberCount',
      component: menberCount,
      meta :{
      	title : '会员统计'
      }
    },
    {
      path: '/saleCardDetail',
      name: 'saleCardDetail',
      component: saleCardDetail,
      meta :{
      	title : '购卡明细'
      }
    },
    {
      path: '/profitCount',
      name: 'profitCount',
      component: profitCount,
      meta :{
      	title : '收益统计'
      }
    },
    {
      path: '/staff',
      name: 'staff',
      component: staff,
      meta :{
      	title : '我的职员'
      }
    },
    {
      path: '/staffDetail',
      name: 'staffDetail',
      component: staffDetail,
      meta :{
      	title : '职员详情'
      }
    },
    {
      path: '/addStaff',
      name: 'addStaff',
      component: addStaff,
      meta :{
      	title : '新增职员'
      }
    },
    {
      path: '/stafHistory',
      name: 'stafHistory',
      component: stafHistory,
      meta :{
      	title : '职员添加记录'
      }
    },
    {
      path: '/buyCard',
      name: 'buyCard',
      component: buyCard,
      meta :{
      	title : '在线购卡'
      }
    },
    {
      path: '/shopList',
      name: 'shopList',
      component: shopList,
      meta :{
      	title : '在线购卡'
      }
    },
    {
      path: '/buyCardAddresss',
      name: 'buyCardAddresss',
      component: buyCardAddresss,
      meta :{
      	title : '在线购卡'
      }
    },
    {
      path: '/material',
      name: 'material',
      component: material,
      meta :{
      	title : '在线购卡'
      }
    },
    {
      path: '/memberList',
      name: 'memberList',
      component: memberList,
      meta :{
      	title : '会员列表'
      }
    },
    {
      path: '/memberDetail',
      name: 'memberDetail',
      component: memberDetail,
      meta :{
      	title : '会员详情'
      }
    },
    {
      path: '/information',
      name: 'information',
      component: information,
      meta :{
      	title : '商家入驻'
      }
    },
    {
      path: '/loginInfo',
      name: 'loginInfo',
      component: loginInfo,
      meta :{
      	title : '商家入驻'
      }
    },
    {
      path: '/address',
      name: 'address',
      component: address,
      meta :{
      	title : '商家入驻'
      }
    },
    {
      path: '/aptitude',
      name: 'aptitude',
      component: aptitude,
      meta :{
      	title : '商家入驻'
      }
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview,
      meta :{
      	title : '商家入驻'
      }
    },
    {
      path: '/receivables',
      name: 'receivables',
      component: receivables,
      meta :{
      	title : '二维码收款'
      }
    },
  ]
})
