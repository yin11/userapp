var _time = 0 , ellerNum = 0 ,state ,request = false;


//判断是否在app内打开
function getUserAgentType(){
	if(navigator.userAgent.indexOf("android-broswer") >= 0) {
		return 1;
	} else if(navigator.userAgent.indexOf("ios-broswer") >= 0) {
		return 2;
	} else {
		return 3;
	}
}

function alertMsg(e){
	//alert(e)
}

/*与app交互，立即入驻*/
function admission(){
	try {
		var _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestAdmission.postAndroidAdmission();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestAdmission.postMessage({toekn:""});
		}
	} catch(e) {
		alertMsg(e);
	}
}


/*与app交互，马上分享*/
function share(){
	try {
		var _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestShare.postAndroidShare();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestShare.postMessage({toekn:""});
		}
	} catch(e) {
		alertMsg(e);
	}
}

/*与app交互，进入联盟商家*/
function entryBusiness(){
	try {
		var _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTEntryBusiness.postAndroidEntryBusiness();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTEntryBusiness.postMessage({toekn:""});
		}
	} catch(e) {
		alertMsg(e);
	}
}


/* 与app交互，获取所需要的数据
 * 会员过期时间 ：time
 * 邀请的联盟商家数量 ：ellerNum
 * 用户身份状态（是否会员）:state
 * */
function getPersonData(){
	try {
		var _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTRequestPersonData.getAndroidPersonData();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTRequestPersonData.postMessage({toekn:""});
		}
	} catch(e) {
		alertMsg(e);
	}
}


//获取app传递的用户信息
function ZSTObtainPersonData(msg){
	try {
		if(msg!=''){
			var _data = JSON.parse(msg);
			_time = _data.time;
			ellerNum = _data.ellerNum ;
			state = _data.state;
			request = true ;
		}
	} catch(e) {
		alertMsg(e);
	}
}

//禁止分享
function noShare(){
	try {
		var _type = getUserAgentType();
		if(_type == 1) {
			window.ZSTPostNoShare.postAndroidNoShare();
		} else if(_type == 2) {
			window.webkit.messageHandlers.ZSTPostNoShare.postMessage({toekn:""});
		}
	} catch(e) {
		alertMsg(e);
	}
}



(function (doc, win) {
  let docEl = doc.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) { return }
    docEl.style.zoom = clientWidth / 375
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)


$(document).ready(function(){
	try{
		getPersonData();
		noShare();
		var _setTime = setInterval(function(){ 
			if(request){ 
				if(state == 0){
					$(".head .fl-l").text("使用该功能需开通会员");
					$(".head .fl-r").text("立即开通");
					$('.btn').text("开通会员").attr("onclick",'window.location.href="https://XXXXXXX/memberPage/showPage.html"');
					$(".head").show();
				}else if(state == 1 && _time < 20){
					$("#time").text(_time);
					$(".head").show();
				}
				$("#ellerNum").text(ellerNum);
				clearInterval(_setTime)
			}
		},500);
		$(".item").on("click",function(){
			$(".item").removeClass("active");
			$(this).addClass("active");
			var _num = $(this).index()
			$(".tab-item").hide();
			$(".tab-item").eq(_num).show();
		});
	}catch(e){
		alertMsg(e)
	}
});
