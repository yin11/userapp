
var loading = false;  //滚动加载的状态标记
var _bill=function(){
    this.billValue={
        "token":init.initValue.token,
        "shopId":init.initValue.shopId,
        "pageSize":20
    }

    /*账单页面初始化*/
    this.billReady=function(){
        sessionStorage.clear();
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        bill.billValue={
            "token":init.initValue.token,
            "shopId":init.initValue.shopId,
            "pageSize":20
        };

        init.showNavigationHeight();//导航栏的高度
        bill.billValue.needTotalStatics=1;
        bill.showBillList(bill.billValue);
        $(document).on("click","#ico-select",function(){
            $("#popup-alert").popup();
            $("html,body").css({"height":screen.height,"overflow":"hidden"});
        }).on("click",".btn-position",function(){
            $(".mask,.app-select").hide();
        }).on("click",".type .item",function(event){
            event.stopPropagation();
            $(this).toggleClass("active");
        }).on("click",".sum .item",function(){
            $(this).addClass("active").siblings().removeClass("active");
        }).on("click",".bill-con",function(){
            //bill.goBillDetail();
            var oderNum=$(this).attr("id");
            bill.getBillState(bill.billValue.token,oderNum);
            $("#popup-state").popup();
        }).on("click","#btn",function(){
            bill.screenBtn();
        }).on("click",".popup-return",function(){
            $.closePopup();
            $("html,body").css({"height":"auto","overflow":"auto"});
        })
        $("#start-time").datetimePicker({
            title: '开始时间',
            times: function () {
                return [];
            }
        });
        $("#end-time").datetimePicker({
            title:"结束时间",
            //min: startTime,
            times: function () {
                return [];
            }
        });

        //下拉刷新
        bill.pullRefresh();

        //滚动加载
        bill.rollLoad();

        //选择门店（商家身份可显示，收银员身份隐藏）

        if(init.initValue.state== 7){//商家
            if(parseQueryString(location.href).ispos == 1){
                $(".return").show();
            }else {
                $(".return").hide();
            }
            var _list=getShopSelect(init.initValue.token);
            $("#shop-div").show();
            $("#shop").on("click",function(){
                $("#shop").select({
                    title: "请选择门店",
                    multi: true,
                    items: _list
                });
                $("#shop").select("open");
            })
        }else if(init.initValue.state== 8){//收银员
            $("#shop-div").hide();
        }
    }







    /*
    *  显示账单列表
    *  json
    *  token
    *  shopId  商户编号
    *  shopStoreId  门店编号，商户可以选择门店查看
    *  beginConsumeTime 选择开始时间yyyy-MM-dd,显示大于等于该日期的数据
    *  endConsumeTime  选择结束时间 yyyy-MM-dd，显示小于等于该日期的数据
    *  needTotalStatics  是否还需后台返回总的统计信息 1需要 0不需要，默认1
    *  pageSize  每次返回多少数据，默认20
    *  */
    this.showBillList=function(json){
        sessionStorage.setItem("needTotalStatics", json.needTotalStatics);//将返回的needTotalStatics存入本地
        var _sec=asciiSort(json),before;
        if(bill.billValue.beginConsumeTime !== undefined && bill.billValue.endConsumeTime == undefined){
            before = 1;
        }
        $.ajax({
            type: "GET",
            data:json,
            url: init.ctxpath+"/order/statistics",
            dataType: "json",
           // cache:false,
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    //alert("是否刷新头部"+(sessionStorage.getItem("needTotalStatics") == 1)+JSON.stringify(data.data.totalStatics));
                    if(sessionStorage.getItem("needTotalStatics") == 1){
                        var _json=data.data.totalStatics,
                            totalActualReceive=data.data.totalStatics.totalActualReceive,
                            transCount=data.data.totalStatics.transCount,
                            totalIntegralCount=data.data.totalStatics.totalIntegralCount,
                            totalCouponCount=data.data.totalStatics.totalCouponCount+"张";
                        if(_json.lenegth == 0){//没有数据时，将总数据都写为0
                            //totalActualReceive=0;transCount=0;totalIntegralCount=0;totalCouponCount="0张";
                            init.showBlankPage();
                        }
                        $("#totalActualReceive").text(totalActualReceive);
                        $("#transCount").text(transCount);
                        $("#totalIntegralCount").text(totalIntegralCount);
                        $("#totalCouponCount").text(totalCouponCount);
                        sessionStorage.setItem("needTotalStatics","0");
                        $("#list").html("");
                        if(data.data.orderList.length == 0){
                            //init.showBlankPage();
                        }
                    }
                    bill.getBillList(data.data,before);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){

            }
        });
    }


    /*
    *  获取账单列表
    *  data
    *  before  是否是下拉刷新，1时将数据往前增加
    *  */
    this.getBillList=function(data,before){
        if(data.orderList.length !== 0){
            var html="",src,time="",_class="";
            var monthStatics=data.monthStatics;
            $.each(data.orderList,function(i,n){
                //payWay:1支付宝，2微信，6现金 ，7刷卡
                if(n.payWay==1){
                    src=init.ctxpath+"/app-h5/img/ico-bill-alipay.png" ;
                }else if(n.payWay==2){
                    src=init.ctxpath+"/app-h5/img/ico-bill-wx.png" ;
                }else if(n.payWay==6){
                    src=init.ctxpath+"/app-h5/img/ico-bill-cash.png" ;
                }else if(n.payWay==7){
                    src=init.ctxpath+"/app-h5/img/ico-bill-sk.png" ;
                }
                if(n.consumeMonth.toString().length ==1){
                    var month="0"+n.consumeMonth.toString();
                }
                if(time !== (n.consumeYear.toString()+ month)){//页面滚动加载时，月份的head
                    time = n.consumeYear.toString()+ month;
                    if(sessionStorage.getItem("endTime") !== null){
                        var nowTome=n.consumeYear.toString()+"-"+month;
                        var oldTime=sessionStorage.getItem("endTime");
                        if(oldTime.substring(0,7) !== nowTome ){
                            html+='<section class="screen-box">'+
                                '<p>'+n.consumeYear+'年'+ n.consumeMonth+'月'+'</p>'+
                                '<p>总收款￥<i>'+monthStatics[time].totalActualReceive+'</i>&nbsp;话费回收￥<i>'+monthStatics[time].totalIntegralCount+'</i></p>'+
                                '</section>';
                        }
                    }else {
                        html+='<section class="screen-box">'+
                            '<p>'+n.consumeYear+'年'+ n.consumeMonth+'月'+'</p>'+
                            '<p>总收款￥<i>'+monthStatics[time].totalActualReceive+'</i>&nbsp;话费回收￥<i>'+monthStatics[time].totalIntegralCount+'</i></p>'+
                            '</section>';
                    }
                }
                //页面下拉刷新时，月份的head与下拉得到的数据月份相同时
                if(before == 1 && (n.consumeYear.toString()+ month) == bill.billValue.beginConsumeTime.substring(0,7)){
                    if(i==1){
                        html+='<section class="screen-box">'+
                            '<p>'+n.consumeYear+'年'+ n.consumeMonth+'月'+'</p>'+
                            '<p>总收款￥<i>'+monthStatics[time].totalActualReceive+'</i>&nbsp;话费回收￥<i>'+monthStatics[time].totalIntegralCount+'</i></p>'+
                            '</section>';
                    }
                   $(".screen-box").first().remove();
                }

                //将开始时间与结束时间存入本地
                if(i == 0){
                    sessionStorage.setItem("beginTime", (n.consumeYear+"-"+n.consumeTimeFAT));//获取的列表的第一个的时间
                }else if(i == (data.orderList.length-1)){
                    sessionStorage.setItem("endTime", (n.consumeYear+"-"+n.consumeTimeFAT));//获取的列表的最后一个的时间
                }

                if(n.state == -1){
                    _class="ico-waiting-pay";
                }else if(n.state == 2){
                    _class="ico-refund";
                }else if(n.state == 0){
                    _class="ico-waiting-pay";
                }
                html+='<div class="bill-con border-bottom" id="'+ n.orderNum+'">'+
                        //'<input type="hidden" value="'+ n.cashierNum+'" id="cashierNum">'+
                        '<div class="bill-title ">'+
                            '<p class="clearfix">'+
                                '<span class="fl_l">订单ID:<i>'+n.orderNum+'</i></span>'+
                                '<span class="fl_r time '+_class+'" attr-year="'+n.consumeYear+'">'+ n.consumeTimeFAT+'</span>'+
                            '</p>'+
                        '</div>'+
                        '<div class="bill-detail ">'+
                        '<div class="bill-img" state="'+n.payWay+'"><img src="'+src+'" width="100%"></div>'+
                        '<div>'+
                        '<p class="price">￥<i class="actualPayMoney">'+ n.actualPayMoney+ '</i></p>'+
                        '<p class="">话币抵扣¥<i class="integralCount">'+ n.integralCount+'</i></p>'+
                        '</div>'+
                        '</div>'+
                    '</div>';
            })
            if(before ==1){
                $("#list").prepend(html);
            }else {
                $("#list").append(html);
            }
        }else {
            if($("#list").length !== 0){
                $.toast("没有更多","text");
            }
        }
    }

    /*
    *  账单页滚动加载数据
    *  */
    this.rollLoad=function(){
        $(document.body).infinite(100).on("infinite", function() {
            if(loading){
                return;
            }
            loading = true;
            $(".weui-loadmore").show();
            setTimeout(function() {
                bill.billValue.endConsumeTime=sessionStorage.getItem("endTime").substring(0,10);
                bill.billValue.needTotalStatics=0;
                delete bill.billValue.beginConsumeTime;//删除beginConsumeTime数据
                $(".weui-loadmore").hide();
                bill.showBillList(bill.billValue);
                loading = false;
            }, 1000);   //模拟延迟
        });
    }

    /*
    *  下拉刷新账单列表
    * */
    this.pullRefresh=function(){
        $('#con').pullToRefresh().on('pull-to-refresh', function (done) {
            if($('html').scrollTop() > 0) return;
            var self = this
            setTimeout(function() {
                $(self).pullToRefreshDone();
                /*bill.billValue={
                    "token":bill.billValue.token,
                    "shopId":bill.billValue.shopId,
                    "needTotalStatics":1,
                    "pageSize":20
                };*/
                bill.billValue.needTotalStatics=1;
                var beginConsumeTime=$(".bill-con").first().find(".time").attr("attr-year")+"-"+$(".bill-con").first().find(".time").text();
                bill.billValue.beginConsumeTime=beginConsumeTime.substring(0,10);
                delete bill.billValue.endConsumeTime;//删除endConsumeTime数据
                //sessionStorage.clear();
                bill.showBillList(bill.billValue);
            }, 2000);
        })
    }

    /*
    *  筛选账单
    * */
    this.screenBtn=function(){
        if($(".type .active").length == 0){
            $.toast("请选择一个订单类型","text");
        }else if($("#start-time").val() == ""){
            $.toast("请选择开始时间","text");
        }else if($("#end-time").val() == ""){
            $.toast("请选择结束时间","text");
        }else {
            var typeVal="";
            for(var i=0;i<$(".type .active").length;i++){
                typeVal+=$(".type .active").eq(i).attr("value")+",";
            }
            typeVal=typeVal.substring(0,typeVal.length-1);
            bill.billValue.payWay=typeVal;
            bill.billValue.beginConsumeTime=$.trim($("#start-time").val());
            bill.billValue.endConsumeTime=$.trim($("#end-time").val());
            if($("#shop").attr("data-values") !== ""){
                bill.billValue.shopStoreId=$("#shop").attr("data-values");
            }
            $.closePopup();
            sessionStorage.setItem("needTotalStatics","1");
            $("html,body").css({"height":"auto","overflow":"auto"});
            $("#popup-alert").removeClass("weui-popup__container--visible");
            $("#list").html("");
            bill.showBillList(bill.billValue);
        }
    }


    /*
     *  进入账单详情页
     *  obj
     * */
    this.goBillDetail=function(obj){
        var _id=obj.attr("id"),
            _actualPayMoney=obj.find(".actualPayMoney").text(),
            _cashierNum=obj.find("#cashierNum").val(),
            _integralCount=obj.find(".integralCount").text(),
            _time=obj.find(".price .fl_r").attr("attr-year")+"-"+obj.find(".price .fl_r").text(),
            _state=obj.find(".bill-img").attr("state");
        _time=_time.substring(0,10);
        var detail='{'+
            '"id":"'+_id+
            '","payMoney":"'+_actualPayMoney+
            '","cashierNum":"'+_cashierNum+
            '","integral":"'+_integralCount+
            '","time":"'+_time+
            '","state":"'+_state+
        '"}';
        sessionStorage.setItem("billDetail",detail);
        window.location.href="bill-detail.html";
    }

    /*
    *  显示账单详情
    *  orderNum
    *  */
    this.showBillDetail=function(){
        init.initReady();
        var billDetail=sessionStorage.getItem("billDetail");
        console.log(billDetail);
        var json = JSON.parse(billDetail);
        $("#id").text(json.id);
        $("#actualPayMoney").text(json.payMoney);
        $("#cashierNum").text(json.cashierNum);
        $("#integralCount").text(json.integral);
        $("#time").text(json.time);
        json.state == 1? $("#payway").text("支付宝"):(json.state == 2?$("#payway").text("微信"):$("#payway").text("现金"));
        $("#shopName").text(init.initValue.shopName);
    }


    /*
    *  获取订单状态
    *  token
    *  orderNum
    * */
    this.getBillState=function(token,orderNum){
        var _sec=asciiSort({"token":token,"orderNum":orderNum}),payTxt="",stateTxt="";
        $.ajax({
            type: "GET",
            data:{"token":token,"orderNum":orderNum},
            url: init.ctxpath+"/cashier/paystatus/query",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    if(data.data.payWay == 1){
                        payTxt="支付宝";
                    }else if(data.data.payWay == 2){
                        payTxt="微信";
                    }else if(data.data.payWay == 6){
                        payTxt="现金";
                    }else if(data.data.payWay == 7){
                        payTxt="刷卡";
                    }
                    if(data.state ==1){
                        stateTxt="成功";
                    }else if(data.state ==-1){
                        stateTxt="失败";
                    }else if(data.state ==2){
                        stateTxt="退款";
                    }else if(data.state ==0){
                        stateTxt="待付款";
                    }
                    var data=data.data;
                    $("#orderNum").text(data.orderNum);
                    $("#totalMoney").text(data.totalMoney);
                    $("#shouldPayMoney").text(data.shouldPayMoney);
                    $("#payTime").text(slewTime(data.payTime));
                    $("#consumePhone").text(data.consumePhone );
                    $("#payWay").text(payTxt);
                    $("#state").text(stateTxt);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){

            }
        });
    }





}
var bill=new _bill();