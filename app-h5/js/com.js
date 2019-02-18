var initLoading = false;  //WEUI滚动加载状态标记
var _init=function(){
    /*返回上一页*/
    this.goBack=function(){
        window.history.go(-1)
    }

    //定义初始值
    this.ctxpath=location.protocol+"//"+location.host+"/sapi";
    this.initValue={
        "key":"XXXXXXXXX",
        "flag":0,
        "filter":0
    };

    //reg正则
    this.reg={
        "nunReg":/^\d+(\.\d{1,2})?$/,    //只匹配数字与小数点
        "frequencyReg":/^[1-9]\d*$/,  //整数
        "discountReg":/^(10|\d)(\.\d)?$/ ,  //折扣输
        "imgReg":/\.(png|GIF|gif|jpg)/,    //是否含有图片格式
        "nameReg":/[\u4E00-\u9FA5]{2,4}/    //匹配中文姓名
    };

    //初始化页面（二级页）
    this.initReady=function(){
        $(document).on("click","a.return",function(){
            init.goBack();
        })
    }

    /*
     * select弹出筛选组件
     * arr  弹出框的选项,数组形式
     * */
    this.initShowSelect=function(arr){
        var flag=init.initValue.flag;
        var conHtml="",html="",_class="";
        $.each(arr, function(index){
            flag == index?_class="avtive":_class="";
            html+='<li class="item '+_class+'" ><span>'+this+'</span></li>'
        });
        conHtml='<div class="mask"></div>'+
            '<section class="app-select">'+
            '<ul>'+ html+ '</ul>'+
            '<div class="alert-foot" onclick="init.initHideSelect()"><button>取消</button></div>'+
            '</section>';
        $("body").append(conHtml);
        var _h=-$(".app-select").height()/2;
        $(".app-select").css("margin-top",_h);
    }

    /*
     *  弹出框li选项
     *  obj 选择对象
     *  callback 返回函数
     *  josn  : flag  状态分类 , token , pagnum 起始页 默认为1 , filter 1
     * */
    this.initScreenAlect=function(o,callback,josn){
        o.addClass("avtive").siblings().removeClass("avtive");
        josn.flag=o.index();
        init.initValue.flag=o.index();
        init.initHideSelect();
        josn.filter=1;
        josn.pagnum=1;
        callback.call(this,josn);
    }


    this.getTotalPage=function(filter,totalPage,totalCount){
        /*加载列表时，将总页数,总条数返回到initValue*/
        totalPage !== null?init.initValue.totalPage=totalPage:init.initValue.totalPage;
        totalCount !== null?init.initValue.totalCount=totalCount:init.initValue.totalCount;
        /*判断筛选后，清空列表再加载*/
        if(filter === 1){
            $("#list").html("");
        }
    }

    /*弹出select消失*/
    this.initHideSelect=function(){
        $(".mask,.app-select").remove();
    }

    /*将yyyymmdd的时间格式转为yyyy-mm-dd格式*/
    this.changeTimeFormat=function(t){
        var t= t.toString();
        var time= t.substring(0, 4)+"-"+ t.substring(4, 6)+"-"+t.substring(6, 8);
        return time;
    }

    /*获取当前日期，且将该日期转为数字*/
    /*需获取服务器时间才准确*/
    this.getCurrentTime=function(){
        var _time = new Date();
        var year=_time.getFullYear().toString();
        var month=(_time.getMonth()+1).toString();
        var day=_time.getDate().toString();
        month.length ==1 ? month ="0"+month:month;
        day.length ==1 ? day ="0"+day:day;
        _time=year+month+day;
        _time=parseInt(_time);//字符串转数字
        return _time;
    }


    /*
    *  页面下拉滚动
    *  json  所有的参数以json的格式传入:pagenum   当前已显示的页数,token,flag  选择状态
    * */
    this.rollLoad=function(json,callback){
        $(document.body).infinite().on("infinite", function() {
            if(initLoading) return;
            initLoading = true;
            $(".weui-loadmore").show();
            setTimeout(function() {
                if(json.pagenum<init.initValue.totalPage){//当前页与总页数
                    json.pagenum = (++json.pagenum);
                    $(".weui-loadmore").hide();
                    callback.call(this,json);
                }else {
                    $(".weui-loadmore").hide();
                    $.toast("已拉到底部","text");

                }
                initLoading = false;
            }, 1500);   //模拟延迟
        });
    }




    /*
    *  输入搜索查询
    *  callback 返回函数
    *  */
    this.searchQuery=function(callback){
        $("#search").bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                callback.call();
            }
        });
    }


    /*
    *  显示空白页
    *  */
    this.showBlankPage=function(){
        var html='<div class="blank-page">'+
                    '<img width="100%" src="data:image/png;base64,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">'+
                    '<p>没有数据呦亲</p>'+
                '</div>';
        //$("#load").html(html);
        $("#list").append(html);
    }

    /*
    *  将URL传递的导航栏的高度写入页面
    * */
    this.showNavigationHeight=function(){
        if(getQueryString("status_bar_height") !== null){
            $("header").css("padding-top",getQueryString("status_bar_height"));
            $("body").css("padding-top",getQueryString("status_bar_height")+45);
        }
    }
}
var init ;
(function(){
    init = new _init();
})();

/*获取门店下拉信息*/
function getShopSelect(token){
    var arr=[],itme={},
        _sec=asciiSort({"token":token});
    $.ajax({
        type: "GET",
        data:{"token":token},
        url: init.ctxpath+"/voip/shopStores/get",
        dataType: "json",
        headers:{"sec": md5(_sec)},
        success:function(data){
            if(data.state == 1){
                $.each(data.data,function(i,n){
                    itme={
                        title: n.storeName,
                        value: n.id
                    }
                    arr.push(itme);
                })
                console.log(arr)
                console.log(typeof arr)
            }else{
                $.toast(data.msg,"text");
            }
        },
        error:function(a,b,c){
            console.log(a+","+b+","+c)
        }
    });
    return arr;
}


/*积分与卡券公共部分*/
var _tickerAndIntegral=function(){
    this.timePicker=function(token){
        var time=new Date();
        var startTime=$("#start-time").val();
        var endTime=$("#end-time").val();
        startTime == "" ? startTime = time.toLocaleDateString() : startTime = startTime;
        $("#start-time").datetimePicker({
            title: '开始时间',
            times: function () {
                return [];
            },
            onChange: function (picker, values, displayValues) {
                //console.log("values:"+values+",picker:"+picker+",displayValues:"+displayValues);
            },
            onClose:function(){
                return startTime=$("#start-time").val();
            }
        });
        $("#end-time").datetimePicker({
            title:"结束时间",
            min: startTime,
            times: function () {
                return [];
            },
            onChange: function (picker, values, displayValues) {
                //console.log(values);
            },
            onClose:function(){
                return endTime=$("#end-time").val();
            }
        });

        var _list=getShopSelect(token);
        $("#shop").on("click",function(){
            $("#shop").select({
                title: "请选择门店",
                multi: true,
                items: _list
            });
            $("#shop").select("open");
        })
    }
}
var tickerAndIntegral = new _tickerAndIntegral();




/*
*  ascall码排序
*  json
*  */
function asciiSort(json){
    var arr=[],_json={},str="",reg=/\,/;
    $.each(json,function(i,n){
        if(n !== "" && n !==undefined){
            arr.push(i);
        }
    });
    arr.sort();
    for(var i=0;i<arr.length;i++){
        var name=arr[i];
        if(reg.test(json[name])){//参数值含有逗号，替换成+
            _json[name]=json[name].replace(/\,/g,"+");
        }else {
            _json[name]=json[name];
        }
    }
    _json=JSON.stringify(_json).replace(/\:/g,"=").replace(/\,/g,"&").replace(/\"/g,"").replace('{',"").replace('}',"");//json转字符串
    _json=_json.replace(/\+/g,',');
    _json=_json + "&key="+init.initValue.key;
    return _json;
}



/*
*  unix时间戳转为 yyyy-mm-dd格式
*  unix 时间戳
*  */
function slewTime(unix){
    var _time= new Date( unix*1000),time,
        year=_time.getFullYear(),
        month=_time.getMonth()+ 1,
        date=_time.getDate(),
        hours=_time.getHours(),
        minutes=_time.getMinutes(),
        seconds=_time.getSeconds();
    month.toString().length == 2 ?  month: month="0"+month;
    date.toString().length == 2 ?  date: date="0"+date;
    hours.toString().length == 2 ?  hours: hours="0"+hours;
    minutes.toString().length == 2 ?  minutes: minutes="0"+minutes;
    seconds.toString().length == 2 ?  seconds: seconds="0"+seconds;
    time=year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
    return time;
}



/* 取消toast弹出 */
$(document).on("click",".weui-mask_transparent",function(){
    $(".weui-toast,.weui-mask_transparent").remove();
})

//把url的参数部分转化成json对象
function parseQueryString(url) {
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
}


/*
*  获取安卓地址栏参数(导航栏的高度)
* */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

/*适配iphoneX*/
function showiPhoneNavigationHeight(){
    if(getQueryString("status_bar_height") !== null){
        $("header").css("padding-top",getQueryString("status_bar_height"));
        $("body").css("padding-top",getQueryString("status_bar_height")+45);
    }else {
        $("header").css("padding-top","15px");
        $("body").css("padding-top","60px");
        $(".icon").css("top","15px");
    }
}