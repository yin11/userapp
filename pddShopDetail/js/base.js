
var base = {
    ctxpath:window.location.origin,
   
    token: '' ,
    key:"XXXXXXXXX",
    doGet:function(json){
        $.ajax({
            type :'GET',
            url: base.ctxpath + json.url,
            data:json.data,
            headers:{"sec":md5(asciiSort(json.data)),'userAgent':'zst-android-broswer',},
            async:json.async?json.async:true,
            cache:false,
            dataType: "json",
            success : json.sucess,
            error : json.error?json.error:function(xhr,textStatus,errorThrown){base.errorprocess(xhr,textStatus,errorThrown,json.url);}
        });
    },
    doPost:function(json){
        $.ajax({
            type :'POST',
            url:base.ctxpath + json.url,
            data:json.data,
            headers:{"sec":md5(asciiSort(json.data)),'userAgent':'zst-android-broswer',},
            async:json.async?json.async:true,
            cache:false,
            dataType: "json",
            success : json.sucess,
            error : json.error?json.error:function(xhr,textStatus,errorThrown){base.errorprocess(xhr,textStatus,errorThrown,json.url);}
        });
    },
    /**
     * 集中错误处理机制
     */
    errorprocess:function(xhr,textStatus,errorThrown,_url){
        base.addToast("请求失败");
        base.doPost({
            url:base.ctxpath+"/error/log",
            data:{
                "token":base.token,
                "deviceType":'3',
                "logContent":(xhr?(xhr.status||''):'')+" url:"+(_url||'')+",textStatus:"+(textStatus||'')+",errorThrown:"+(errorThrown||'')+",userAgent:"+navigator.userAgent
            },
            success:function(){},
            error:function(xhr,textStatus,textThrows){/*alert((xhr.status||'')+" "+_url+" "+textStatus+"  "+textThrows);*/}
        });
    },
    parseQueryString:function(url){//把url的参数部分转化成json对象
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },
    isNvl:function(o,dest){
        return o||dest ;
    },
    addToast:function(txt){
        var html='<div class="toast">'+
            '<div class="toast-mask"></div>'+
            '<span class="toast-con">'+txt+'</span>'+
            '</div>';
        $("body").append(html);
        var _h = $(".toast-con").height();
        var _w = $(".toast-con").width();
        $(".toast-con").css({"margin-top":-(_h/2),"margin-left":-(_w/2)});
        setTimeout(function() {
            base.removeToast();
        },2000)
    },
    showDailog:function(){

    },
    removeToast:function(){
        $(".toast").remove();
    },
    /*
     *  获取安卓地址栏参数(导航栏的高度)
     * */
    getQueryString:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
};

/**
 * 判断是否在助商通或者糖公鸡内里面
 * @returns {number}
 */
function judgeType(){
    if(navigator.userAgent.indexOf("android-broswer") >= 0  ){
        return 1;
    }else if(navigator.userAgent.indexOf("ios-broswer") >= 0){
        return 2;
    }else{
        return 3 ;
    }
}

//告诉ios页面title标题
function postTitleIOS(title){
    try{
        var type= judgeType();
        if(type == 2) {
            window.webkit.messageHandlers.ZSTRequestPostTitle.postMessage(title);
        }
    }catch(e){
        console.log(e);
    }
}
//告诉安卓页面图片信息
function postImgAndroid(img){
    try{
        var type= judgeType();
        if(type == 1) {
            window.ZSTRequestpostImg.postImgAndroid(img);
        }
    }catch(e){
        console.log(e);
    }
}
//告诉安卓页面商品简介信息
function postStrAndroid(str){
    try{
         var type= judgeType();
        if(type == 1) {
            window.ZSTRequestpostStr.postStrAndroid(str);
        }
    }catch(e){
        console.log(e) ;
    }
   
}





//跳转拼多多app
//json ---pid推广位id  ， goodsId 拼多多商品ID
function goPDDIos(json){
    window.webkit.messageHandlers.ZSTRequestGoPDD.postMessage(json);
}
function goPDDAndroid(json){
	var _json = JSON.stringify(json) ;
    window.ZSTRequestGoPDD.goPDDAndroid(_json);
}
function goPDD(json){
    try{
        var type= judgeType();
        if(type == 1){
            goPDDAndroid(json);
        }else if(type == 2) {
            goPDDIos(json);
        }
    }catch(e){
        console.log(e)
    }
}
/**
 * 充值
 * @returns
 */
function Recharge(){
    try{
        var type= judgeType();
        if(type == 1){
            getAndroidRechargeableCoin();
        }else if(type == 2) {
            goIosRecharge();
        }
    }catch(e){
        console.log(e)
    }
}
function getAndroidRechargeableCoin(){
    window.ZSTRequestRechargeableCoin.getAndroidRechargeableCoin()
}
function goIosRecharge() {
    window.webkit.messageHandlers.ZSTRequestRecharge.postMessage({token:""});
}
//返回登录界面
function GoLogin(){
    try{
        var type= judgeType();
        if(type == 1){
            AndroidGoLogin();
        }else if(type == 2) {
            getIosGoLogin();
        }
    }catch(e){
        console.log(e)
    }
}
function AndroidGoLogin(){
    window.ZSTRequestGoLogin.AndroidGoLogin()
}
function getIosGoLogin() {
    window.webkit.messageHandlers.ZSTRequestGoLogin.postMessage({});
}



//获取推广位id
function getPositionId(){
    base.positionId = base.getQueryString("positionId");
    /*var type= judgeType();
    if(type == 1){
        getAndroidPositionId();
    }else if(type == 2) {
        getIosPositionId();
    }else {
        base.positionId = base.getQueryString(positionId);
    }*/
}
function getAndroidPositionId(){
    window.ZSTRequestPositionId.getAndroidPositionId();
}
function getIosPositionId() {
    window.webkit.messageHandlers.ZSTRequestPositionId.postMessage({
        positionId:""
    });
}

function ZSTObtainPositionId(msg) {
    base.positionId = msg ;
}



/*
 *  与OC交互，将需要的参数名传给客户端
 * */
function getToken(){
    try{
    	var type= judgeType();
		if( type == 1 ){
		    window.ZSTRequestParameter.getAndroidParameter() ;
		}else if( type == 2 ){
             window.webkit.messageHandlers.ZSTRequestParameter.postMessage({token:""});
        }
    }catch(e){
        console.log(e) ;
    }
}



//获取token等信息
function ZSTObtainParameter(msg) {
	if(msg != '(null)'){
		base.token = msg ;
	}
}



//获取领取弹窗显示的公司名称和图片
function getAlertMsg(){
    try{
        //alert("getAlertMsg")
        var type= judgeType();
        if(type == 1){
            getAndroidAlertMsg();
        }else if(type == 2) {
            getIosAlertMsg();
        }else{
            $("#alertImg").attr("src","http://static.tenzhao.com/share/shareLogo.png");
            $("#alertTxt").text("助商通");
        }
    }catch(e){
        console.log(e);
    }
}
function getAndroidAlertMsg(){
    //alert("getAndroidAlertMsg")
    window.ZSTRequestAlertMsg.getAndroidAlertMsg('alertImg,alertTxt');
}
function getIosAlertMsg() {
    //alert("getIosAlertMsg")
    window.webkit.messageHandlers.ZSTRequestAlertMsg.postMessage({
        alertImg:"",
        alertTxt:""
    });
}
function ZSTObtainAlertMsg(data) {
    try{
        var _data ;
        if((typeof data) == 'string'){
            _data = JSON.parse(data) ;
        }else{
            _data = data;
        }
        var _alertImg = base.isNvl(_data.alertImg,"http://static.tenzhao.com/share/shareLogo.png"),
            _alertTxt = base.isNvl(_data.alertTxt,"助商通");
        $("#alertImg").attr("src",_alertImg);
        $("#alertTxt").text(_alertTxt);
    }catch(e){
        console.log(e)
    }
}


//返回登录界面
function GoLogin(){
    try{
        var type= judgeType();
        if(type == 1){
            AndroidGoLogin();
        }else if(type == 2) {
            getIosGoLogin();
        }
    }catch(e){
        console.log(e)
    }
}
function AndroidGoLogin(){
    window.ZSTRequestGoLogin.AndroidGoLogin()
}
function getIosGoLogin() {
    window.webkit.messageHandlers.ZSTRequestGoLogin.postMessage({});
}


/*
 *  ascall码排序
 *  json
 *  */
function asciiSort(json){
    var arr=[],_json={},str="",reg=/\,/,str="";
    $.each(json,function(i,n){
        if(n !== "" && n !==undefined){
            arr.push(i);
        }
    });
    arr.sort();
    for(var i=0;i<arr.length;i++){
        var name=arr[i];
        str+="&"+name+"="+json[name];
    }
    str=str.substring(1)+ "&key="+base.key;
    return str;
}

(function(doc, win) {
    var html = doc.getElementsByTagName("html")[0],
        reEvt = "orientationchange" in win ? "orientationchange" : "resize",
        reFontSize = function() {
            var clientW = doc.documentElement.clientWidth || doc.body.clientWidth;
            if(!clientW) {
                return;
            }
            html.style.fontSize = 20 * (clientW / 375) + "px";
        }
    win.addEventListener(reEvt, reFontSize);
    doc.addEventListener("DOMContentLoaded", reFontSize);
})(document, window);


/**
 * 分享外部链接时
 */
function shareLink(title,desc,img){
    var signature = {} ;
    (function(){
        $.ajax({
            async:false,
            cache:false,
            dataType:"json",
            type:"get",
            url:"https://XXXXXXXX?url="+encodeURIComponent(encodeURIComponent(window.location.href)),
            success:function(data){
                signature = data ;
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                errorprocess(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    })();
    wx.config({
        debug: false,
        appId: signature.appid,
        timestamp: signature.timestamp,
        nonceStr: signature.noncestr,
        signature: signature.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems'
        ]
    });

    wx.ready(function () {
        //var shareImg = window.location.origin+'/zst-wap/toutiao/img/logo.jpg';
        var shareImg = img;
        var shareData = {
            title: title,
            desc: desc,
            link: signature.url,
            imgUrl: shareImg,
            success:function(res){/*alert("ok")*/}
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareQQ(shareData);
        wx.onMenuShareWeibo(shareData);
        wx.onMenuShareQZone(shareData);

    });

    wx.error(function (res) {
        alert(res.errMsg);
    });
}

