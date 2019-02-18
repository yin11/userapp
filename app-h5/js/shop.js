var _shop=function(){

    this.shopValue={
        "token":"XXXXXXXXX",
        "flag":0,
        "filter":0,
        "pagenum":1
    }


    /*
    *  商城订单初始化
    *  */
    this.orderReady=function(){
        //返回
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        shop.showOrderList(shop.shopValue);

        $(document).on("click",".goods-detail",function(){
            shop.goOrderDetail($(this));
        }).on("click",".delivery-btn",function(){
            shop.goDelivery($(this));
        }).on("click",".logistics-btn",function(){
            shop.goLogistics($(this));
        }).on("click",".type .item",function(){
            $(this).toggleClass("active");
        }).on("click",".sum .item",function(){
            $(this).addClass("active").siblings().removeClass("active");
        }).on("click","#ico-select",function(){
            $("#about").popup();
        }).on("click",".tab .item",function(){
            $(".tab .item").find("span").removeClass("current");
            $(this).find("span").addClass("current");
            init.initValue.flag=$(this).index();
            //shop.showOrderList(init.initValue);
        }).on("click", ".close-btn", function() {
            $.confirm("您确定要关闭订单吗?", "关闭订单?", function() {
                $.toast("订单已关闭!","text");
            }, function() {
                //取消操作
            });
        }).on("click",".remind-btn",function(){
            $.toast("消息提醒已发送","text");
        }).on("click",".refund-btn",function(){
            $.confirm("您确定要退款吗?", "退款", function() {
                $.toast("已退款!","text");
            }, function() {
                //取消操作
            });
        });

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
    }

    /*
    *  显示订单列表
    *  json
    *  token
    *  flag
    *  pagenum
    *  limit
    *  state   未发货,已发货,未付款，退款，已收货
    *  */
    this.showOrderList=function(json){
        var state;
        //json.flag === 1 ? state=0:( json.flag === 2 ? state=1:(json.flag === 3 ?state=2:state));
        var _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token,"state":state});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token,"state":state},
            url: init.ctxpath+"/voip/getKtOrderlist",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    if(state == 0){//未发货状态
                        stateHtml='<span class="state fl_r">待发货</span>';
                        operationHtml='<div class="order-delivery clearfix border-top"><button class="fl_r delivery-btn">立即发货</button></div>';
                    }else if(state == 1){//已发货状态
                        stateHtml='<span class="state fl_r">已发货</span>';
                        operationHtml='<div class="order-delivery clearfix border-top"><button class="fl_r logistics-btn">查看物流</button></div>';
                    }/*else if(state == 2){//未付款状态
                        stateHtml='<span class="state fl_r">未付款</span>';
                        operationHtml='<div class="order-delivery clearfix border-top"><button class="fl_r close-btn">关闭订单</button><button class="fl_r remind-btn">提醒付款</button></div>';
                    }*/else if(state == 3){//退款状态
                        stateHtml='<span class="state fl_r">申请退款</span>';
                        operationHtml='<div class="order-delivery clearfix border-top"><button class="fl_r refund-btn">确认退款</button></div>';
                    }else if(state == 3){//已收货状态
                        stateHtml='<span class="state fl_r">已收货</span>';
                    }
                    init.getTotalPage(json.filter,data.totalPage,data.totalCount);
                    shop.getOrderList(data.data,stateHtml,operationHtml);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*
    *  订单列表接口请求成功后
    *  data
    *  stateHtml
    *  operationHtml
    * */
    this.getOrderList=function(data,stateHtml,operationHtml){
        var _class="",html="";
        $.each(data,function(i,n){
            html+='<div class="order-con">'+
                    '<div class="info-title ">'+
                        '<p class="clearfix">'+
                            '<span class="fl_l">订单ID:<i class="order_id">'+ n.order_id+'</i></span>'+
                            stateHtml+
                        '</p>'+
                    '</div>'+
                    '<div class="goods-detail ">'+
                        //'<a href="javascript:void (0)">'+
                            '<div class="order-img"><img src="../../img/shop-head.png" width="100%"></div>'+
                            '<div>'+
                                '<p class="info-name text-overflow">'+ n.name+'</p>'+
                                '<p class="more-text-overflow">商品详情</p>'+
                                '<p class="clearfix"><span class="fl_l">￥<i>634.98</i></span><span class="fl_r">x<i>'+ n.number+'</i></span></p>'+
                            '</div>'+
                        //'</a>'+
                    '</div>'+
                    operationHtml+
                '</div>';
        });
        $("#list").append(html);
    }

    /*
    *  跳转订单详情页面
    *  obj   拿到当前的订单id号
    *  */
    this.goOrderDetail=function(obj){
        window.location.href="order-detail.html?id="+obj.find(".order_id").text();
    }

    /*
    *  订单列表跳转立即发货也
    *  obj 获取id
    *  */
    this.goDelivery=function(obj){
        window.location.href="delivery.html?id="+obj.attr("id");
    }

    /*
    *  订单列表跳转查看物流页
    *  obj获取id
    *  */
    this.goLogistics=function(obj){
        window.location.href="logistics.html?id="+obj.attr("id");
    }

    /*
    *  获取物流信息
    *  id
    *  nu  订单号
    *  com  要查询的快递公司代码
    * */
    this.getLogistics=function(nu){
        var html="";
        $.ajax({
            type: "GET",
            //data:{"id":,"pagenum":json.pagenum,"nu":nu,"valicode":"","show":},
            url: "http://api.kuaidi100.com/api?id=75c6732a7ad4ac5c&com="+[]+"&nu="+[]+"&valicode="+[]+"&show="+[0|1|2|3]+"&muti="+[0|1]+"&order="+[desc|asc],
            dataType: "json",
            success:function(data){
                if(data.status == 1){
                    $.each(data.data,function(i,n){
                        if(i==1){
                            if(n.context =="客户已签收"){
                                $("#state,#logistics-state").text("已签收");
                            }else {
                                $("#state,#logistics-state").text("派件中");
                            }
                        }
                        html+='<li class="logistics-con">'+
                                    '<p class="logistics-state">'+ n.context+'</p>'+
                                    '<p class="logistics-time">'+ n.time+'</p>'+
                                '</li>';
                    })
                    $("#list").append(html);
                }

            },
            error:function(){

            }
        });

    }


}
var shop = new _shop();