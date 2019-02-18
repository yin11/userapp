/*
 * 请求接口合集
 * */

import fetch from './fetch'


/*获取账号相关的资金信息*/
const getAgZstMenuData = (data) => fetch({
	url: '/api/voip/agent/getAgentAccountInfo',
	method: 'get',
	params: data
});


/*获取用户相关信息*/
const getUserInfo = (data) => fetch({
	url: '/api/voip/agent/getAgentBasisInfo',
	method: 'get',
	params: data
});



/*获取短信验证码*/
const postSendMess = (data) => fetch({
	url: '/api/voip/v2/smsSecurityCode',
	method: 'post',
	params: data
});


/*提交后台验证手机号码和验证码是否正确*/
const getTestCode = (data) =>fetch({
	url: '/api/voip/agent/validateSmsEditphone',
	method: 'get',
	params: data
});


/*申请提现的验证码审核接口*/
const putCashCode = (data) => fetch({
	url: '/api/voip/withdraw/sms',
	method: 'post',
	params: data
});


/*用户提现*/
const withdraw = (data) =>fetch({
	url: '/api/voip/agent/withdraw',
	method: 'post',
	params: data
});


/*用户获取现金账户信息*/
const getCashAccount = (data) =>fetch({
	url: '/api/voip/user/cashAccount',
	method: 'get',
	params: data
});


/*代理商提现记录*/
const getWithdrawList = (data) =>fetch({
	url: '/api/voip/agent/withdraw/info',
	method: 'get',
	params: data
});



/*代理商可提现冻结金额接口*/
const getFrozen = (data) =>fetch({
	url: '/api/voip/agent/getAgentMoneyInfo',
	method: 'get',
	params: data
});



/*获取收益统计列表(已结算列表)*/
const getZstAmounts = (data) =>fetch({
	url: '/api/voip/agent/zstamounts/log/v3',
	method: 'get',
	params: data
});


/*获取收益统计列表(预收入列表)*/
const getPreincomeAmounts = (data) =>fetch({
	url: '/api/voip/agent/preincomeamounts/log/v3',
	method: 'get',
	params: data
});



/*获取代理商推荐的商家列表*/
const getRefereeList = (data) =>fetch({
	url: '/api/voip/agent/data/shop/list',
	method: 'get',
	params: data
});


/*获取商家详情接口*/
const getApplyAgentInfo = (data) =>fetch({
	url: '/api/voip/agent/shop/info',
	method: 'get',
	params: data
});




/*获取代理商售卡统计相关信息*/
const getAgentSaleCard = (data) =>fetch({
	url: '/api/voip/agent/shop/card',
	method: 'get',
	params: data
});


/*获取代理商购卡明细列表信息*/
const getAgentCardList = (data) =>fetch({
	url: '/api/voip/agent/data/card/list',
	method: 'get',
	params: data
});


/*获取代理商购卡订单的明细*/
const getAgentCardDetail = (data) =>fetch({
	url: '',
	method: 'get',
	params: data
});


/*获取代理商职员列表信息*/
const getAgentStaff = (data) =>fetch({
	url: '/api/voip/agstaff/listPage',
	method: 'post',
	params: data
});

/*获取职员个人信息详情*/
const getStaffDetail = (data) =>fetch({
	url: '/api/voip/agstaff/detail',
	method: 'post',
	params: data
});

/*代理商注销或激活职员*/
const addStaff = (data) =>fetch({
	url: '/api/voip/agstaff/add',
	method: 'post',
	params: data
});

/*新增职员*/
const setStaffState = (data) =>fetch({
	url: '/api/voip/agstaff/setState',
	method: 'post',
	params: data
});

/*编辑职员*/
const editStaff = (data) =>fetch({
	url: '/api/voip/agstaff/edit',
	method: 'post',
	params: data
});


/*本月新增会员信息*/
const getNewMember = (data) =>fetch({
	url: '/api/voip/agent/getAgentMemberInfo',
	method: 'get',
	params: data
});


/*本月新增商家信息*/
const getNewShop = (data) =>fetch({
	url: '/api/voip/agent/data/shop',
	method: 'get',
	params: data
});


/*获取商家购卡统计的相关信息*/
const getStoreCardStatistics = (data) =>fetch({
	url: '/api/voip/agent/shop/card',
	method: 'get',
	params: data
});

/*获取商家会员统计的相关信息*/
const getStoreMembeStatistics = (data) =>fetch({
	url: '/api/voip/agent/shop/member',
	method: 'get',
	params: data
});

/*获取商家收益统计的相关信息*/
const getStoreProfitStatistics = (data) =>fetch({
	url: '/api/voip/agent/shop/profit',
	method: 'get',
	params: data
});



/*累计服务商下的会员统计*/
const getMembeStatistics = (data) =>fetch({
	url: '/api/voip/agent/data/member',
	method: 'get',
	params: data
});


/*获取会员列表*/
const getMembeList = (data) =>fetch({
	url: '/api/voip/agent/data/member/list',
	method: 'get',
	params: data
});



/*入驻商家时获取行业类型*/
const getTypeList = (data) =>fetch({
	url: '/api/voip/shop/dealcate/type',
	method: 'get',
	params: data
});

/*通过详细地址获取地区经纬度*/
const getDefaultLocation = (address) => fetch({
	url: '/api/voip/get/shop/address',
	method: 'get',
	params: {
		ak: "mbvBHlSGfpglilGIOmpuHnTMWbdoqnxP",
		address: address,
	}
});

/*验证商家名称是否已经存在*/
const testReferee = (data) =>fetch({
	url: '/api/voip/add/shop/validate/shopname',
	method: 'get',
	params: data
});

//获取推荐联盟商家的收款二维码
const allianceshop = (data) =>fetch({
	url: '/api/voip/receiptqr/allianceshop',
	method: 'post',
	params: data
});


//在线购卡
const getBuyCard = (data) =>fetch({
	url: '/api/voip/agent/buyCard/add',
	method: 'get',
	params: data
});



//在线购卡app支付成功后，修改订单状态
const getBuyCardUpd = (data) =>fetch({
	url: '/api/voip/agent/buyCard/upd',
	method: 'get',
	params: data
});


/*在线购卡，获取代理商下面的商家列表*/
const getAgentStoreList = (data) =>fetch({
	url: '/api/voip/agent/buyCard/view',
	method: 'get',
	params: data
});


export {
	getAgZstMenuData , getUserInfo , postSendMess , getTestCode , withdraw , 
	getZstAmounts , getPreincomeAmounts , getCashAccount ,putCashCode , getRefereeList ,
	getWithdrawList , getFrozen , getAgentSaleCard , getAgentCardList , getAgentCardDetail , getAgentStaff ,editStaff , 
	getStaffDetail , setStaffState , addStaff ,
	getApplyAgentInfo , getStoreCardStatistics , getStoreMembeStatistics , getStoreProfitStatistics ,
	getNewMember , getNewShop , getMembeStatistics , getTypeList , getDefaultLocation , testReferee ,
	allianceshop , getBuyCard , getBuyCardUpd , getAgentStoreList , getMembeList
}