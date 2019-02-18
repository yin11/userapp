/*
 *  与OC交互，将需要的参数名传给客户端
 * */
function getAndroidParameter(){
    //调用android程序中的方法
    window.ZSTRequestParameter.getAndroidParameter()
}
function getIosParameter() {
    window.webkit.messageHandlers.ZSTRequestParameter.postMessage({
        token:"",
        shopName:"商户名称111",
        key:"",
        shopId:"",
        state:1
    });
}

//获取
function ZSTObtainParameter(msg) {
    //init.initValue=JSON.parse(msg);//字符串转json
    $.extend(init.initValue,JSON.parse(msg));//合并init.initValue
    //alert("客户端请求token:"+init.initValue.token);
    /*$.toast("1token:"+init.initValue.token,"text");*/
}

//关闭webview
function goBackReturnIos(){
    window.webkit.messageHandlers.ZSTShut.postMessage({
        url:""
    });
}
function goBackReturnAndroid(){
    //调用android程序中的方法
    window.ZSTRequestParameter.goBackReturnAndroid();
}


//判断是安卓还是IOS
function judgeType(){
    if(navigator.userAgent.indexOf("zst-android-broswer") >= 0){
        return true;
    }else if(navigator.userAgent.indexOf("zst-ios-broswer") >= 0){
        return false;
    }
}

function getParameter(){
    if(judgeType()){
        getAndroidParameter();
    }else {
        getIosParameter();
    }

}

function goBackReturn(){
    if(judgeType()){
        goBackReturnAndroid();
    }else {
        goBackReturnIos();
    }

}


/*
*   代理商页面
* */

