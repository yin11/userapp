import fetch from './fetch'

let TOKEN , BALANCE ,USERID ,ADDRESS ,MEMBER , PAYSTATE = 0 ;
const USER_AGENT = {IOS:{K:"ios-XXX",V:0},ANDROID:{K:"android-XXX",V:1},OTHERS:{K:"",V:2}}

/*获取商品详细*/
var getStoreDetail = (data) => fetch({
	url: '/api/voip/zst/good/detail',
	method: 'get',
	params: data
});

/*获取商品库存*/
const getGoodInventory = (data) => fetch({
	url: '/api/voip/zst/goodinventory/detail',
	method: 'get',
	params: data
});


/*获取默认地址接口*/
const getAddress = (data) => fetch({
	url: '/api/voip/user/receiptAddress/get',
	method: 'get',
	params: data
});

//获取账户话币余额
const getBalance = (data) => fetch({
	url: '/api/voip/user/balance',
	method: 'post',
	params: data
});

//获取评价列表
const getEvaluate = (data) => fetch({
	url: '/api/voip/zst/onlineorder/comment/list',
	method: 'get',
	params: data
});

/*获取会员用户购买上限*/
const getLimited = (data) => fetch({
	url: '/api/voip/zst/good/buynum/limit',
	method: 'get',
	params: data
});



/*搜索查询商品*/
const getSearchList = (data) => fetch({
	url: '/api/voip/goods/index/search',
	method: 'get',
	params: data
});


/*取消收藏*/
const cancelCollection = (data) => fetch({
	url: '/api/voip/goods/collection/cancel',
	method: 'post',
	params: data
});


/*新增收藏*/
const addCollection = (data) => fetch({
	url: '/api/voip/goods/collection/add',
	method: 'post',
	params: data
});

/*查询商品是否被收藏*/
const stateCollection = (data) => fetch({
	url: '/api/voip/goods/collection/state',
	method: 'post',
	params: data
});



/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
	if(!name) return;
	window.sessionStorage.removeItem(name);
}


/**
 * 获取地址栏参数
 */
const getQueryString=(name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}


//获取token等信息
const ZSTObtainParameter = (msg) => {
	try{
    	TOKEN = msg ;
    }catch(e){
        alertMsg(e) ;
    }
}


//APP支付成功时，通知页面已经支付成功(msg为1，代表支付成功)
const ZSTPaySuccess = (msg) => {
	try{
    	if(msg == 1){
    		setStore('PAYSTATE',msg); //将支付方式存入缓存
    		PAYSTATE = msg ;
    	}
    }catch(e){
        alertMsg(e) ;
    }
}







//获取用户是否已经是会员
const ZSTObtainMember = (msg) => {
	try{
    	MEMBER = msg ;
    }catch(e){
        alertMsg(e) ;
    }
}



//获取用户id等信息
const ZSTObtainUserId = (msg) => {
	try{
    	USERID = msg ;
    }catch(e){
        alertMsg(e) ;
    }
}

const ZSTGetAddress = (msg) => {
	try{
		//jump('order');
		let _address = JSON.parse(msg);
		ADDRESS = _address ;
    }catch(e){
        alertMsg(e) ;
    }
}


//打印错误信息
const alertMsg = (msg) => {
	//alert(msg)
}


//判断是否在app内打开
const getUserAgentType = () =>{
	if(navigator.userAgent.indexOf(USER_AGENT.ANDROID.K) >= 0){
	    return 1 ;
	}else if(navigator.userAgent.indexOf(USER_AGENT.IOS.K) >= 0){
         return 2 ;
    }else{
    	return 3 ;
    }
}

//告诉安卓页面图片信息
const postImgAndroid = (img) =>{
	try{
    	 let _type = getUserAgentType() ;
	    if(_type == 1) {
	        window.ZSTRequestpostImg.postImgAndroid(img);
	    }
    }catch(e){
        alertMsg(e) ;
    }
}

//告诉安卓页面商品简介
const postStrAndroid = (str) =>{
	try{
    	 let _type = getUserAgentType() ;
	    if(_type == 1) {
	        window.ZSTRequestpostStr.postStrAndroid(str);
	    }
    }catch(e){
        alertMsg(e) ;
    }
}

//告诉ios页面title标题
const postTitleIOS = (title) =>{
    try{
        let _type = getUserAgentType() ;
        if(_type == 2) {
            window.webkit.messageHandlers.ZSTRequestPostTitle.postMessage(title);
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*
 *  与OC交互，将需要的参数名传给客户端
 * */
const getToken=()=>{
    try{
    	let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestParameter.getAndroidParameter() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRequestParameter.postMessage({token:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}

/*
 *  与OC交互，申请获取用户是否为会员
 * */
const getMember=()=>{
    try{
    	let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestMember.getAndroidMember() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRequestMember.postMessage({token:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}



/*
 *  与OC交互，将需要的参数名传给客户端
 * */
const getUserId=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestUserId.getAndroidUserId() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRequestUserId.postMessage({UserId:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}

/*吊起APP充值界面*/
const Recharge=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestRechargeableCoin.getAndroidRechargeableCoin() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRequestRecharge.postMessage({token:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*跳转APP地址列表页*/
const openAddressList=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTOpenAddressList.openAndroidAddress() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTOpenAddressList.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*提交订单——向OC提交相关信息*/
const postOrder = (json) => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
			let _data = JSON.stringify(json);
		    window.ZSTPostOrder.postAndroidOrder(_data) ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTPostOrder.postMessage(json);
        }
    }catch(e){
        alertMsg(e) ;
    }
}

/*向app提交第三方的价格对比链接*/
const postLink = (json) => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
			let _data = JSON.stringify(json);
		    window.ZSTPostLink.postAndroidLink(_data) ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTPostLink.postMessage(json);
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*跳转app登录*/
const GoLogin = () => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestGoLogin.AndroidGoLogin();
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRequestGoLogin.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*跳转app订单列表页*/
const GoOrderList = () => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestGoOrderList.AndroidGoOrderList();
		}else if( _type == 2 ){
            window.webkit.messageHandlers.ZSTRequestGoOrderList.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*跳转app首页*/
const GoAPPIndex = () => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestGoAPPIndex.AndroidGoAPPIndex();
		}else if( _type == 2 ){
            window.webkit.messageHandlers.ZSTRequestGoAPPIndex.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}





/*在线咨询——OC端吊起客服电话*/
const postService = () => {
	alertMsg('zaix')
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTPostService.postAndroidService(json) ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTPostService.postMessage(json);
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*平滑滚动*/
const jump = (id)=>{
    let jump = document.querySelectorAll('.'+id);
    let total = jump[0].offsetTop ;
    let distance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ;
    distance = distance + 20 ;
    // 平滑滚动，时长500ms，每10ms一跳，共50跳
    let step = total / 30;
    if (total > distance) {
      smoothDown();
    } else {
      let newTotal = distance - total;
      step = newTotal / 30;
      smoothUp();
    }
    
    function smoothDown(){
		if (distance < total) {
			distance += step;
			document.body.scrollTop = distance;
	        document.documentElement.scrollTop = distance ;
	        setTimeout(smoothDown, 10);
	    } else {
	        document.body.scrollTop = total;
	        document.documentElement.scrollTop = total;
	    }
	}
	function smoothUp(){
		if (distance > total) {
	        distance -= step;
	　　　　　　document.body.scrollTop = distance;
	        document.documentElement.scrollTop = distance;
	        setTimeout(smoothUp, 10);
	    } else {
			document.body.scrollTop = total;
			document.documentElement.scrollTop = total;
	    }
	} 
}

/**
 * 表单校验
 */
const rule={
  empty:function(str,mess){//不能为空
    if(str=='' || !str){
      toast(mess)
      return false
    }else{
      return true
    }
  },
  phone:function(str) {//手机号校验
    var myReg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
		if(!myReg.test(str)) {
			toast('手机号码有误')
			return false
		} else {
			return true
		}
  },
}


/**
 * toast提示语
 */
const toast = (msg = '', time = 2000) => {
    var toast = document.createElement('div')
    toast.className = 'common-toast common-toast-show'
    toast.innerHTML = msg
    document.body.appendChild(toast)
    toast.style.display = 'block'
    toast.style.margin = `-${toast.offsetHeight / 2}px 0 0 -${toast.offsetWidth / 2}px`
    var timer = setTimeout(() => {
      toast.className = 'common-toast common-toast-hide'
      clearTimeout(timer)
      var timer2 = setTimeout(() => {
        document.body.removeChild(toast)
        clearTimeout(timer2)
      }, 200)
    }, time)
}

/*时间戳转为日期格式*/
const timestampToTime = (timestamp) => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}


const isNVL = (str,dest) =>{
	 return str||dest ;
}



export {
	isNVL,
	timestampToTime ,
	openAddressList,
	postImgAndroid,
	postStrAndroid,
	postTitleIOS ,
	getUserId,GoLogin, getStoreDetail , Recharge, getLimited ,
	getToken , getMember,
	jump ,getGoodInventory ,ZSTGetAddress, GoOrderList , GoAPPIndex , ZSTPaySuccess ,
	TOKEN ,USERID,ADDRESS,MEMBER, PAYSTATE , postOrder ,rule ,toast ,
	BALANCE ,getQueryString , getAddress ,postService ,
	ZSTObtainParameter ,ZSTObtainUserId ,ZSTObtainMember,
	getBalance ,alertMsg,postLink,getEvaluate , getSearchList , cancelCollection ,addCollection ,  stateCollection , getUserAgentType
}


