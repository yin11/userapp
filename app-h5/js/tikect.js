var _ticket=function(){
    this.ticketValue={
        "pagenum":1,
        
        "token":init.initValue.token,
        "shopName":init.initValue.shopName,
        "shopId":init.initValue.shopId,
    }


    /*卡券活动初始化页面*/
    this.ticketReady=function(){
        //init.initReady();
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        ticket.ticketValue={
            "pagenum":1,
            "flag":0,
            "token":init.initValue.token
        };
        ticket.showTicketList(ticket.ticketValue);
        $("#ico-select").on("click",function(){
            var arr = [ "全部", "活动未开始", "活动中","活动已结束"];
            init.initShowSelect(arr);
        });
        $("#ico-add").click(function(){
            window.location.href="new-coupons.html";
        });
        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),ticket.showTicketList,ticket.ticketValue);
        }).on("click",".activity-con",function(){
            ticket.goTicketDetail($(this));
        });
        //滚动加载
        init.rollLoad(ticket.ticketValue,ticket.showTicketList);
        //输入搜索查询
        //init.searchQuery(ticket.ticketInputNumber);


    }

    /*
    *  获取卡券活动列表
    *  json : token ,pagenum 当前页 ,limit 分页单位10 非必须 ,flag(活动状态 ：0活动未开始 1活动已开始 2活动已结束(activeType)) ,filter  1 第一次筛选时清空
    * */
    this.showTicketList=function(json){
        var activeType;
        json.flag === 1 ? activeType=0:( json.flag === 2 ? activeType=1:(json.flag === 3 ?activeType=2:activeType));
        var _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token,"activeType":activeType});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token,"activeType":activeType},
            url: init.ctxpath+"/voip/cardcouponActionList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(json.filter,data.totalPage,data.totalCount);
                    ticket.getTicketList(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }


    /*
     *  请求卡券活动列表成功后
     *  data 数据
     *  */
    this.getTicketList=function(data){
        var _class="",html="",_txt="";
        $.each(data,function(i,n){
            if(n.state == 0){
                _class=" full-cut not-begin";
                _txt="未开始";
            }else if(n.state == 1){
                _class=" full-cut ongoing";
                _txt="活动中";
            }else  if(n.state == 2){
                _class=" discount over";
                _txt="已结束";
            }

            html+='<div class="activity-con '+_class+'">'+
                '<div class="activity-num">'+
                '<p>活动编号：<span class="id_num">'+ n.id+'</span></p>'+
                '<span class="ticket-state">'+_txt+'</span>'+
                '</div>'+
                '<div class="flex-box">'+
                '<div class="item">满'+n.consumeMoney+'减'+n.couponMoney+'</div>'+
                '<div class="item">'+
                '<p>已推送</p><p>'+ n.pushedCount+'</p>'+
                '</div>'+
                '<div class="item">'+
                '<p>已领取</p><p>'+ n.receivedCount+'</p>'+
                '</div>'+
                '<div class="item">'+
                '<p>已使用</p><p>'+ n.usedCount+'</p>'+
                ' </div>'+
                '</div>'+
                '</div>';
        });
        $("#list").append(html);
        return;
    }

    /*
    *  判断输入卡券活动查询内容
    * */
    this.ticketInputNumber=function(){
        var search=$.trim($("#search").val()),flag=true;
        if(search == ""){
            $.toast("请输入搜索的内容","text");
            flag=false;
        }else if(!init.reg.nunReg.test(search)){
            $.toast("请输入数字","text");
            flag=false;
        }else {
            ticket.ticketInputQuery(search);
        }
        return false;
    }

    /*
    *  查询卡券活动
    *  search  输入的内容
    *  couponMoney 卡券面额
    *  uuid  活动编号
    * */
    this.ticketInputQuery=function(search){
        var parameter="";
        search.length == 26? parameter = "uuid": parameter ="couponMoney";
        var _sec=asciiSort({"limit":init.initValue.totalCount,"pagenum":1,"token":init.initValue.token,parameter:search});
        $.ajax({
            type: "GET",
            data:{"limit":init.initValue.totalCount,"pagenum":1,"token":init.initValue.token,parameter:search},
            url: init.ctxpath+"/voip/cardcouponActionList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(1,data.totalPage,data.totalCount);
                    if(data.totalCount==0){
                        $.toast("没有相匹配的数据","text");
                    }else {
                        ticket.getTicketList(data.data);
                    }
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*
    *  跳转卡券活动详情
    *  uuid   活动id
    * */
    this.goTicketDetail=function(obj){
        var integralPagenum=Math.ceil((obj.index()+1)/10);//选中的活动所在的页数
        sessionStorage.setItem("uuid",obj.find(".id_num").text());
        sessionStorage.setItem("integralPagenum",integralPagenum);
        window.location.href="ticker-detail.html";
    }

    /*
    *  获取卡券活动详情
    * */
    this.showIntegralDetail=function(token){
        var _id=sessionStorage.getItem("uuid");//选中的id
        var _pagenum=sessionStorage.getItem("integralPagenum");//当前页
        var _sec=asciiSort({"limit":10,"pagenum":_pagenum,"token":token});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":_pagenum,"token":token},
            url: init.ctxpath+"/voip/cardcouponActionList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.each(data.data,function(i,n){
                        if(n.id == _id){
                            $("#num_id").text(n.id);
                            $("#couponCount").text(n.couponCount);
                            $("#consumeMoney").text(n.consumeMoney);
                            $("#couponMoney").text(n.couponMoney);
                            $("#pushedCount").text(n.pushedCount);
                            $("#receivedCount").text(n.receivedCount);
                            $("#usedCount").text(n.usedCount);
                            $("#startDate").text(init.changeTimeFormat(n.startDate));
                            $("#endDate").text(init.changeTimeFormat(n.endDate));
                            $("#remark").text(n.remark);
                            $("#validReceiveDays").text(n.validReceiveDays);
                            n.state == 2 ? $("#overdue").text(n.couponCount-n.usedCount):$("#overdue").text("0");
                            n.state == 0 ? $("#detialed").attr("disabled",true):$("#detialed").attr("disabled",false);
                        }
                    });
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*卡券活动详情初始化页面*/
    this.ticketDetailReady=function(){
        init.initReady();
        ticket.showIntegralDetail(init.initValue.token);
        $("#detialed").on("click",function(){
            window.location.href="ticker-detailed.html";
        })
    }




    /*卡券明细初始化页面*/
    this.ticketDetailedReady=function(){
        ticket.ticketValue={
            "pagenum":1,
            "flag":0,
            "token":init.initValue.token,
            "filter":0
        };
        init.initReady();
        ticket.ticketValue.uuid=sessionStorage.getItem("uuid");//选中的id
        ticket.ticketValue.pagenum=sessionStorage.getItem("integralPagenum");//当前页
        ticket.showTicketDetailedList(ticket.ticketValue);
        $("#ico-select").on("click",function(){
            var arr = [ "全部","未领取", "已领取","已消费","已过期"];
            init.initShowSelect(arr);
        });
        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),ticket.showTicketDetailedList,init.initValue);
        });
        //滚动加载
        init.rollLoad(init.initValue,ticket.showTicketDetailedList);
        //输入搜索查询
        init.searchQuery(ticket.ticketDetailInputNumber);
    }

    /*
     *  判断输入卡券明细查询内容
     * */
    this.ticketDetailInputNumber=function(){
        var search=$.trim($("#search").val()),flag=true;
        if(search == ""){
            $.toast("请输入搜索的内容","text");
            flag=false;
        }else if(!init.reg.nunReg.test(search)){
            $.toast("请输入数字","text");
            flag=false;
        }else {
            ticket.ticketDetailInputQuery(search);
        }
        return false;
    }

    /*
    *  查询卡券明细
    *  token
    *  limit
    *  pagenum
    *  uuid
    *  state
    *  curentHolderPhone  卡券所属人
    *  search  输入的内容
    *  */
    this.ticketDetailInputQuery=function(search){
        var _sec=asciiSort({"token":ticket.ticketValue.token,"limit":ticket.ticketValue.totalCount,"pagenum":1,"uuid":ticket.ticketValue.uuid,"curentHolderPhone":search});
        $.ajax({
            type: "GET",
            data:{"token":ticket.ticketValue.token,"limit":ticket.ticketValue.totalCount,"pagenum":1,"uuid":ticket.ticketValue.uuid,"curentHolderPhone":search},
            url: init.ctxpath+"/voip/cardcouponDetal",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(1,data.totalPage,data.totalCount);
                    if(data.totalCount==0){
                        $.toast("没有相匹配的数据","text");
                        init.showBlankPage();
                    }else {
                        ticket.getTicketList(data.data);
                    }
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*
    *  获取卡券明细列表
    *  json
    *  token
    *  flag   卡券状态state
    *  pagenum
    *  uuid   uuid
    *  filter  1 第一次筛选时清空
    * */
    this.showTicketDetailedList=function(json){
        var _class="",html="",state,_html="";
        json.flag >0 ? state=json.flag : state;
        var _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token,"uuid":json.uuid,"state":state});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token,"uuid":json.uuid,"state":state},
            url: init.ctxpath+"/voip/cardcouponDetal",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(json.filter,data.totalPage);
                    $.each(data.data,function(i,n){
                        if(n.state>0){
                            if(n.state ==  1){
                                _html='<div class="ticket-state">未领取</div>';
                                _class="ongoing";
                            }else if(n.state ==  2){
                                _html='<div class="ticket-state">已领取</div>';
                                _class="not-begin";
                            }else if(n.state ==  3){
                                _html='<div class="ticket-state">已消费</div>';
                                _class="blue";
                            }else if(n.state ==  4){
                                _html='<div class="ticket-state">已过期</div>';
                                _class="over";
                            }
                            html+='<div class="ticker-con '+_class+'">'+
                                    _html+
                                    '<div class="vertical-line"></div>'+
                                    '<div class="con-text">'+
                                        '<p><span>编&nbsp;&nbsp;号</span><span>'+ n.couponNum+'</span></p>'+
                                        '<p><span>所属人</span><span>'+ n.curentHolderPhone+'</span></p>'+
                                    '</div>'+
                                '</div>';
                        }
                    });
                    $("#list").append(html);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }


    /*新增卡券初始化页面*/
    this.addTicketReady=function(){
        init.initReady();
        $("#shopName").text(init.initValue.shopName);
        //timePicker
        tickerAndIntegral.timePicker(init.initValue.token);
        $("#sub").on("click",function(){
            ticket.subFormValidate();
        });
    }

    /*
    *  新增卡券
    *  token,
    *  couponCount 卡券数量(Number)
    *  consumeMoney  消费额度(Number)
    *  shopStoreId  门店编号 多个门店用逗号区分(string)
    *  startDate  开始时间(Number)
    *  endDates  结束时间(Number)
    *  couponMoney  券面金额(Number)
    *  validReceiveDays  有效天数(Number)
    *  remarks  备注(string)
    * */
    this.addTicket=function(json){
        var _sec=asciiSort(json);
        $.ajax({
            type: "POST",
            data:json,
            url: init.ctxpath+"/voip/insertCardcoupon",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.toast("新增卡券成功","text");
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){
                console.log(a+","+b+","+c)
            }
        });
    }

    /*新增卡券页提交表单验证*/
    this.subFormValidate=function(){
        var couponTitle = $.trim($("#title").val()),
            total = $.trim($("#total").val()),
            discount = $.trim($("#discount").val()),
            frequency = $.trim($("#frequency").val()),
            startTime = $("#start-time").val(),
            endTime = $("#end-time").val(),
            shop = $("#shop").attr("data-values"),
            term = $.trim($("#term").val()),
            validReceiveDays=$("#validReceiveDays").val();
        var flag = true;
        if(couponTitle == ""){
            $.toast("请输入卡券标题", "text" );
            flag = false;
        }else if(total == ""){
            $.toast("请输入条件金额", "text" );
            flag = false;
        }else if(!init.reg.nunReg.test(total)){
            $.toast("满减金额只满足包含两位小数的数字", "text" );
            flag = false;
        }else if(discount == ""){
            $.toast("请输入优惠金额", "text" );
            flag = false;
        }else if(!init.reg.nunReg.test(discount)){
            $.toast("满减金额只满足包含两位小数的数字", "text" );
            flag = false;
        }else if(parseInt(total) < parseInt(discount)){
            $.toast("优惠金额不能大于条件金额", "text" );
            flag = false;
        }else if(frequency == ""){
            $.toast("请输入次数", "text" );
            flag = false;
        }else if(!init.reg.frequencyReg.test(frequency)){
            $.toast("请输入符合格式的次数", "text" );
            flag = false;
        }else  if(startTime == ""){
            $.toast("开始时间不能为空", "text" );
            flag = false;
        }else  if(endTime == ""){
            $.toast("结束时间不能为空", "text" );
            flag = false;
        }else  if(endTime < startTime){
            $.toast("结束时间不能大于开始时间", "text" );
            flag = false;
        }else if(validReceiveDays == ""){
            $.toast("有效天数不能为空", "text" );
            flag = false;
        }else if(!init.reg.frequencyReg.test(validReceiveDays)){
            $.toast("请输入符合格式的天数有效天数为正整数", "text" );
            flag = false;
        }else if(shop == ""){
            $.toast("请选择门店", "text" );
            flag = false;
        }else  if(term == ""){
            $.toast("请输入使用条件", "text" ,9000);
            flag = false;
        }else {
            var formValue={
                "token" : init.initValue.token ,
                "couponTitle":couponTitle,
                "couponCount" : parseInt(frequency) ,
                "consumeMoney" : parseInt(total) ,
                "couponMoney" : parseInt(discount) ,
                "validReceiveDays" : parseInt(validReceiveDays),
                "shopStoreId" : shop ,
                "startDate" : parseInt(startTime.replace(/-/g, '')) ,
                "endDate" : parseInt(endTime.replace(/-/g, '')) ,
                "remark": term
                //"discountRate":"0"
            };
            ticket.addTicket(formValue);
            /*$.showLoading();
            setTimeout(function() {
                $.hideLoading();
            }, 2000)*/
        }
        return flag;
    }


}
var ticket = new _ticket();