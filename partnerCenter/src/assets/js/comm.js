
let TOKEN = '' ,
	ZFB , OPENID , LONG , LAT , USERINFO = {}, status_bar_height , IMGFORMDATA = {} , PAYSTATE;

const USER_AGENT = {
	IOS: {
		K: "ios-broswer",
		V: 0
	},
	ANDROID: {
		K: "android-broswer",
		V: 1
	},
	OTHERS: {
		K: "",
		V: 2
	}
}

const alertMsg = (e) => {
	//alert(e)
	//console.log(e)
}

const isNVL = (str, dest) => {
	return str || dest;
}


//判断是否在app内打开
const getUserAgentType = () => {
	if(navigator.userAgent.indexOf(USER_AGENT.ANDROID.K) >= 0) {
		return 1;
	} else if(navigator.userAgent.indexOf(USER_AGENT.IOS.K) >= 0) {
		return 2;
	} else {
		return 3;
	}
}


/*
 *  与OC交互，将需要的参数名传给客户端
 * */
const getToken = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestParameter.getAndroidParameter();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestParameter.postMessage({
				token: ""
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}

/*
 *  与OC交互，告诉客户端，需要当前位置经纬度
 * */
const getGPS = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestGPS.getAndroidGPS();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestGPS.postMessage({
				token: ""
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}


/*
 *  与OC交互，将顶部导航栏的颜色传给APP (color 为 000000,安卓不识别#)
 * */
const postColor = (color) => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTPostColor.postAndroidColor('#ff'+color);
		} 
	} catch(e) {
		alertMsg(e);
	}
}


/*禁止刷新*/
const noRefresh = () => {
	try {
		let _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTNoRefresh.getAndroidNoRefresh();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestNoReady.postMessage({
				data: ''
			});
		}
	} catch(e) {
		alertMsg(e);
	}
}




//获取token等信息
const ZSTObtainParameter = (msg) => {
	try {
		if(msg !="(null)"){
			let _type = getUserAgentType();
			if(_type == 1) {
				TOKEN = msg;
			} else if(_type == 2) {
				if(msg.indexOf('{')>= 0){
					TOKEN =  JSON.parse(msg).token;
				}else{
					TOKEN =  msg;
				}
			}
		}
	} catch(e) {
		alertMsg(e);
	}
}


//获取用户当前所在位置的经纬度 ,(msg格式：经度,纬度)
const ZSTGetGPS = (msg) => {
	try{
		let _data = msg.split(',') ;
		LONG = _data[0]  ; //经度
		LAT = _data[1] ;//纬度
    }catch(e){
        alertMsg(e) ;
    }
}


//获取用户选中的支付宝账号信息
const ZSTGetZFB = (msg) => {
	try{
		ZFB = JSON.parse(msg);
    }catch(e){
        alertMsg(e) ;
    }
}


//获取用户选中的微信账号的openid
const ZSTGetOpenid = (msg) => {
	try{
		OPENID = msg;
    }catch(e){
        alertMsg(e) ;
    }
}


/*跳转APP支付宝账号列表页*/
const openZFBList=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTOpenZFBList.openAndroidAddress() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTOpenZFBList.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*通知app获取微信openid参数*/
const getWXOpenId=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTGetWXOpenId.openAndroidAddress() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTGetWXOpenId.postMessage({openid:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/*关闭webview*/
const closeWebView=()=>{
    try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRequestParameter.goBackReturnAndroid();
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTShut.postMessage({url:""});
        }
    }catch(e){
        alertMsg(e) ;
    }
}


//APP支付成功时，通知页面已经支付成功(msg为1，代表支付成功)
const ZSTPaySuccess = (msg) => {
	try{
    	if(msg == 1){
    		PAYSTATE = msg ;
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
		    window.ZSTOnlyBuyCard.postAndroidOnlyBuyCard(_data) ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTOnlyBuyCard.postMessage(json);
        }
    }catch(e){
        alertMsg(e) ;
    }
}

/*推荐联盟商家*/
const recommendedBusiness = () => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTRecommendedBusiness.postAndroidRecommendedBusiness() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTRecommendedBusiness.postMessage({});
        }
    }catch(e){
        alertMsg(e) ;
    }
}



/*吊起app推广码页面*/
const getExtension  = () => {
	try{
		let _type = getUserAgentType() ;
		if( _type == 1 ){
		    window.ZSTGetExtension.getAndroidExtension() ;
		}else if( _type == 2 ){
             window.webkit.messageHandlers.ZSTGetExtension.postMessage(json);
        }
    }catch(e){
        alertMsg(e) ;
    }
}


/**
 * 表单校验
 */
const rule = {
	empty: function(str, mess) { //不能为空
		if(str == '') {
			mess == '' ? '' : toast(mess);
			return false
		} else {
			return true
		}
	},
	phone: function(str) { //手机号校验
		let myReg = /^(1)[0-9]{10}$/;
		if(!myReg.test(str)) {
			toast('手机号码有误')
			return false
		} else {
			return true
		}
	},
	testLength: function(str, len) { //验证是否达到指定的最小长度
		if(str.length < len) {
			toast('输入的内容长度小于' + len)
			return false
		} else {
			return true
		}
	},
	testZFB: function(str, mess) { //支付宝账户验证
		var myReg = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/
		if(!myReg.test(str)) {
			mess == '' ? '' : toast(mess);
			//toast('请输入正确的支付宝账户')
			return false
		} else {
			return true
		}
	},
	name: function(str) { //中文姓名
		var myReg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
		if(!myReg.test(str)) {
			toast('请输入正确的姓名')
			return false
		} else {
			return true
		}
	},
	testSum:function(str){ // 验证带小数且不超过两位小数的数值
		let myReg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
		if(!myReg.test(str)) {
			toast('只能输入数值，且小数不超过两位')
			return false
		} else {
			return true
		}
	}
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
	try{
		timestamp = String(timestamp) ;
	    let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	    let Y,M, D, h, m, s;
	    Y = date.getFullYear() + '-';
	    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate() ) + ' ';
	    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours() ) + ':';
	    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes() ) + ':';
	    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds() ) + ' ';
	    return Y+M+D+h+m+s;
    }catch(e){
		alertMsg(e);
	}
}

/**
 * 存储localStorage
 */
const setStore = (name, content) => {
	if(!name) return;
	if(typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
const getStore = name => {
	if(!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除localStorage
 */
const removeStore = name => {
	if(!name) return;
	window.sessionStorage.removeItem(name);
}


//更换状态,str   ，name替换的内容 ,seat 
const replaceNext = (str, name, seat) => {
	try {
		str = str.split('');
		str.splice(seat, 1, name);
		str = str.join('');
		return str;
	} catch(e) {
		alertMsg(e);
	}
}

/**
 * 获取地址栏参数
 */
const getQueryString = (name) => {
	try {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return null;
	} catch(e) {
		alertMsg(e);
	}
}


/*获取当前时间20180505*/
const getNowFormatDate = () => {
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	let currentdate = year + month + strDate;
	return currentdate;
}

//将blob对象转为dataUrl
const readBlobAsDataURL = (blob, callback) => {
	try {
		var a = new FileReader();
		a.onload = function(e) {
			callback(e.target.result);
		};
		a.readAsDataURL(blob);
	} catch(e) {
		alertMsg(e);
	}
}

//dataURL转换为Blob对象
const dataURLtoBlob = (dataurl) => {
	try {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while(n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	} catch(e) {
		alertMsg(e);
	}
}


//加密
const asciiSort = (json) => {
	try {
		let arr = [],
			_json = {},
			str = "",
			reg = /\,/;
		for(i in json) {
			if(json[i] !== "" && json[i] !== undefined && (typeof json[i] != "object")) {
				arr.push(i);
			}
		}
		arr.sort();
		for(var i = 0; i < arr.length; i++) {
			var name = arr[i];
			str += name + "=" + json[name] + "&";
		}
		_json = str + "key=XXXXXXX";
		return _json;
	} catch(e) {
		alertMsg(e);
	}
}





export {
	TOKEN , ZFB , LONG , LAT , USERINFO , status_bar_height ,
	alertMsg , isNVL , toast , getQueryString , noRefresh ,
	getToken , ZSTObtainParameter , openZFBList , ZSTGetZFB , getWXOpenId , ZSTGetOpenid , closeWebView , getGPS , ZSTGetGPS ,
	rule , timestampToTime , setStore , getStore , removeStore , replaceNext , getNowFormatDate , postColor , readBlobAsDataURL ,
	dataURLtoBlob , IMGFORMDATA , asciiSort , postOrder , getExtension , ZSTPaySuccess , PAYSTATE , recommendedBusiness
} 