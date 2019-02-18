/*
*  积分活动
* */
var _integral = function(){
    /*
     *  popup覆盖式弹窗
     * */
    this.popup=function(){
        var html='<div class="mask"></div>'+
            '<ul class="popup">'+
            '<li class="border-bottom" value="2" onclick="integral.onloadActive($(this))">新增满减活动</li>'+
            ' <li class="border-bottom" value="1" onclick="integral.onloadActive($(this))">新增折扣活动</li>'+
            '<li class="alert-foot" onclick="integral.hidePopup()"><button>取消</button></li>'+
            '</ul>';
        $("body").append(html);
    }

    /*隐藏popup覆盖式弹窗*/
    this.hidePopup=function(){
        $(".popup,.mask").remove();
    }

    /*跳转新增活动页*/
    this.onloadActive=function(obj){
        if(obj.attr("value") == 2){
            integral.hidePopup();
            window.location.href="new-plus-active.html?discountType=2";
        }else if(obj.attr("value") == 1){
            integral.hidePopup();
            window.location.href="new-discount-activities.html?discountType=1";
        }
    }

    this.integralValue={
        "pagenum":1,
        //"token":"b8bcc3136aca40ceba69e41fb22999e6",
        "token":init.initValue.token,
        "shopName":init.initValue.shopName,
        "shopId":init.initValue.shopId,
    }


    /*积分活动页面初始化*/
    this.integralReady=function(){
        //返回
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        integral.integralValue={
            "pagenum":1,
            "token":init.initValue.token,
            "flag":0,
            "filter":0
        }
        integral.showIntegralList(integral.integralValue);
        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),integral.showIntegralList,integral.integralValue);
        })
        $("#ico-select").on("click",function(){
            var arr = [ "全部", "折扣活动", "满减活动"];
            init.initShowSelect(arr);
        })
        $("#ico-add").click(function(){
            integral.popup();
        });
        $(document).on("click",".activity-con",function(){
            integral.goIntegralDetail($(this));
        })
        //滚动加载
        init.rollLoad(integral.integralValue,integral.showIntegralList);
        //输入搜索查询
        init.searchQuery(integral.integralInputNumber);
    }

    /*
    *  获取积分列表
    *  json 格式传入
    *  token ，
    *  pagenum 当前页 ，
    *  limit 分页单位10 ， 非必须
    *  flag  1 折扣 、2 满减  非必须(discountType)
    *  filter  1 第一次筛选时清空
    * */
    this.showIntegralList=function(json){
        var discountType;
        json.flag === 1 ? discountType=1:( json.flag === 2 ? discountType=2:discountType );
        var  _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token,"discountType":discountType});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token,"discountType":discountType},
            url: init.ctxpath+"/voip/biIntegralactiveList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(json.filter,data.totalPage,data.totalCount);
                    integral.getIntegralList(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }


    /*
     *  请求积分活动列表成功后
     *  data 数据
     *  */
    this.getIntegralList=function(data){
        var _class="",_html="",html="";
        $.each(data,function(i,n){
            if(n.discountType ==2){//满减
                _class="full-cut";
                _html= '<div class="item">满'+ n.consumeMoney+'减'+ n.availableIntegral+'</div>';
            }else if(n.discountType  ==1){//折扣
                _class="discount";
                _html='<div class="item">sale'+ n.discountRate+'折</div>';
            }
            html+='<div class="activity-con '+_class+'">'+
                '<div class="activity-num">'+
                '<p>活动编号：<span class="id_num">'+n.id+'</span></p>'+
                '</div>'+
                '<div class="flex-box">'+
                _html+
                '<div class="item"><p>已参与人数</p><p>'+ n.partakeCount+'</p></div>'+
                '<div class="item"><p>已参与总次数</p><p>'+ n.partakeTotalCount+'</p></div>'+
                '</div>'+
                '</div>';
        });
        $("#list").append(html);
    }

    /*
    *  输入编号查询积分活动
    *
    *  */
    this.integralInputNumber=function(){
        var search=$.trim($("#search").val()),flag=true;
        if(search == ""){
            $.toast("请输入搜索的内容","text");
            flag=false;
        }else {
            integral.integralInputQuery(search);
        }
        return false;
    }

    /*
     *  查询积分活动
     *  search  输入的内容
     *  uuid  活动编号
     * */
    this.integralInputQuery=function(search){
        var  _sec=asciiSort({"limit":init.initValue.totalCount,"pagenum":1,"token":init.initValue.token,"uuid":search});
        $.ajax({
            type: "GET",
            data:{"limit":init.initValue.totalCount,"pagenum":1,"token":init.initValue.token,"uuid":search},
            url: init.ctxpath+"/voip/biIntegralactiveList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(1,data.totalPage);
                    if(data.totalCount==0){
                        $.toast("没有相匹配的数据","text");
                    }else {
                        integral.getIntegralList(data.data);
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
    * 获取积分活动详情
    * token
    * */
    this.getIntegralDetail=function(token){
        var _id=sessionStorage.getItem("IntegralDetailId"),//选中的id
            _pagenum=sessionStorage.getItem("integralPagenum"),//当前页
            _sec=asciiSort({"limit":10,"pagenum":_pagenum,"token":token});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":_pagenum,"token":token},
            url: init.ctxpath+"/voip/biIntegralactiveList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.each(data.data,function(i,n){
                        if(n.id == _id){
                            $("#num_id").text(n.id);
                            $("#startDate").text(init.changeTimeFormat(n.startDate));
                            $("#endDate").text(init.changeTimeFormat(n.endDate));
                            $("#remark").text(n.remark);
                            $("#partakeCount").text(n.partakeCount);
                            $("#partakeTotalCount").text(n.partakeTotalCount);
                            if(n.discountType ===1){
                                $(".active-detail").html('<p><span class="num">'+ n.discountRate+'</span>折</p>');
                            }else if(n.discountType ===2){
                                $(".active-detail").html('<p>满<span class="num">'+ n.consumeMoney+'</span>减<span class="num">'+ n.availableIntegral+'</span></p>');
                            }
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

    /*
    *  跳转积分详情页
    * */
    this.goIntegralDetail =function(obj){
        var integralPagenum=Math.ceil(obj.index()/10);//选中的活动所在的页数
        sessionStorage.setItem("IntegralDetailId",obj.find(".id_num").text());
        sessionStorage.setItem("integralPagenum",integralPagenum);
        window.location.href="integral-detail.html";
    }


    /*
    *  结束积分活动
    *  token
    *  uuid 活动编号
    * */
    this.overIntegralActivity=function(token,uuid){
        $.ajax({
            type: "POST",
            data:{"token":token,"uuid":uuid},
            url: init.ctxpath+"/voip/stopInActive",
            dataType: "json",
            headers:{"sec": md5(asciiSort({"token":token,"uuid":uuid}))},
            success:function(data){
                if(data.state == 1){
                    $.toast("活动结束!","text");
                    $("#over").removeClass("blur-bg").addClass("ash-bg").attr("disabled","disabled");
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }


    /*积分活动详情初始化*/
    this.integralDetailReady=function(){
        init.initReady();
        integral.getIntegralDetail(init.initValue.token);
        $(".ico-member").click(function(){
            window.location.href="integral-member.html";
        });
        var _id=sessionStorage.getItem("IntegralDetailId");//选中的id
        $(document).on("click", "#over", function() {
            $.confirm("您确定要结束活动吗?", "结束活动?", function() {
                integral.overIntegralActivity(init.initValue.token,_id);
            }, function() {
                //取消操作
            });
        });
    }


    /*
    *  新增积分活动：满减，折扣
    *  state   当前是满减页还是折扣页：1折扣，2满减
    *  token
    *  availableIntegral  可用积分(满减活动)
    *  discountRates  折扣率(限于折扣活动)  默认为0
    *  shopStoreId   门店编号 多个门店用逗号区分
    *  startDate   开始时间
    *  endDates   结束时间
    *  discountType  活动类型 2满优惠价 1折扣优惠
    *  consumeMoney  消费限额(满减活动)  默认为0
    *  remarks  备注
    *  monthCounts  每月可抵扣次数
    * */
    this.addIntegral=function(json,state){
        var txt;
        state == 1 ? txt="新增折扣成功": txt="新增满减成功";
        var _sec=asciiSort(json);
        $.ajax({
            type: "POST",
            data:json,
            url: init.ctxpath+"/voip/insertIntegralactive",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.toast(txt,"text");
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*新增积分活动初始化页面*/
    this.addIntegralReady=function(){
        var _state=window.location.search.charAt(window.location.search.length - 1);//新增活动的分类，1折扣，2满减
        init.initReady();
        $("#shopName").text(init.initValue.shopName);
        //timePicker
        tickerAndIntegral.timePicker(init.initValue.token);

        //表单提交
        $(document).on("click","#sub",function(){
            integral.subFormValidate(_state);
        })
    }


    /*
    *  新增积分活动提交表单验证
    *  state 新增积分活动类型
    * */
    this.subFormValidate=function(state){

        var total = 0, discountRates = "0", discount=0 ,
            frequency = $.trim($("#frequency").val()),
            startTime = $("#start-time").val(),
            endTime = $("#end-time").val(),
            //validDate = $.trim($("#valid-date").val()),
            shop = $("#shop").attr("data-values"),
            term = $.trim($("#term").val());
        var flag = true;
        if(state ==1){//折扣
            discountRates = $.trim($("#discountRates").val());
        }else if(state == 2){//满减
            total = $.trim($("#total").val());
            discount = $.trim($("#discount").val());
        }
        if(total == "" && state == 2){
            $.toast("请输入满减金额", "text" );
            flag = false;
        }else if(!init.reg.nunReg.test(total) && state == 2){
            $.toast("请输入符合格式的满减金额", "text" );
            flag = false;
        }else if(discount == "" && state == 2){
            $.toast("请输入满减金额", "text" );
            flag = false;
        }else if(!init.reg.nunReg.test(discount) && state == 2){
            $.toast("请输入符合格式的满减金额", "text" );
            flag = false;
        }else if(total < discount && state == 2){
            $.toast("优惠金额不能大于条件金额", "text" );
            flag = false;
        }else if(discountRates == "" && state == 1){
            $.toast("折扣不能为空", "text" );
            flag = false;
        }else if(!init.reg.discountReg.test(discountRates) && state == 1){
            $.toast("请输入符合格式的折扣", "text" );
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
        }else if(shop == ""){
            $.toast("请选择门店", "text" );
            flag = false;
        }else  if(term == ""){
            $.toast("请输入使用条件", "text" ,9000);
            flag = false;
        }else {
            var formValue={
                "token" : init.initValue.token ,
                "availableIntegral" : discount,
                "discountRate" : discountRates,
                "shopStoreId" : shop,
                "startDate" : parseInt(startTime.replace(/-/g, '')) ,
                "endDate" : parseInt(endTime.replace(/-/g, '')) ,
                "discountType": parseInt(state),
                "consumeMoney" : parseInt(discount) ,
                "remark": term,
                "monthCount" : parseInt(frequency)
            };
            integral.addIntegral(formValue,state);
           /* $.showLoading();
            setTimeout(function() {
                $.hideLoading();
            }, 2000)*/
        }
        return flag;
    }


    /*
    *  参与活动会员页初始化
    *  */
    this.integralMemberReady=function(){
        init.initReady();
        integral.showIntegralMemberList(init.initValue.token);
        //滚动加载
        init.rollLoad(init.initValue.token,integral.showIntegralMemberList);

    }


    /*
    *  获取活动会员列表
    *  json
    *  token
    *  pagenum
    *  limit
    *  uuid  积分活动编号
    *  */
    this.showIntegralMemberList=function(token){
        var _id=sessionStorage.getItem("IntegralDetailId"),  //选中的id
            _pagenum=sessionStorage.getItem("integralPagenum"), //当前页
            _sec=asciiSort({"limit":10,"pagenum":_pagenum,"token":token,"uuid":_id}),
            html="",phone="",num="",src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABVCAMAAAAPK1hoAAABC1BMVEWapMEAAACapMH7/P2cpsKapMGapMH///+apMHT1+SapMGapMGapMGapMH09fiapMGapMGapMGapMH6+/yapMH+/v7////+/v/7+/2apMH5+vv19vn9/v78/f34+fr29/nt7/Ts7vTq7PLn6fDl6O/a3ujY3OfCyNq2vdKstMz9/f76+vz5+vz5+fv19vn09fjw8fbi5e3f4uvc3+rQ1ePM0eDJzt6gqsX////9/v79/v78/f34+fv29/rr7fP5+vv19vnT1+S+xNf3+Pr9/f7+/v77+/35+vzo6/H29/r5+fv3+Pr8/P38/f74+fv09fj7+/3V2eX09fj+/v73+PrEytv09fjQ1eL////5YHU/AAAAWHRSTlMzADDZAiYt+CoEIQsJDq8aFB0H0hcW/PTUEb2e6OW7tJWSiYB8Z2NKQjsSzcnGrKacdm9qWVRRNQ3x7t/CqI6MeVxHOAnr25SGgGxJMCQjH9ZgXFtZTUgN/syQagAAA5pJREFUWMOtmYdW4zAQRZ8TlzhxiFMIKUCogYRel963L7B99f9fss6GgyHRk2SfvR9wjzyakTwjWFqCZinv5DIDXCdfDguWFmiMNSeDUTJOrZDeWinlwHBLQSpr0YGaXDOxtZiDHjdMZC04MMNtGlvtMsxxKmbWooskZEITawlJyds6q+0gOblAbfVzSEOmoLJWXKQjU+RWLtVTZFafSA2DILfaJKam2kBq5bvfW56f2GhUz7YWrsFxfYm1BsLy5ol45t32AS+zcWsBcnYbYoTWIQilUatNdmpCjFNfACEYsZYh4zArpHRYkcVW/v0HniA0epBSi61s/1c8QamS9PJfWJuQMSMUbEFK+YU1RzeKs6RYLOhSr4Wa+hueXaBRfSc0XMgXaz9ZA2lFCR2efLHhk7VEo5omss6TVVZWb4711g1IqURWUgFdocfrsUoACcC8MGCfhQAkAyZMrHvyLBhYbcg4M7EuQkrBAjlY1kysC+yIgRVCxrqJ9QP5l7FATtZZE+sOO2VBLsEtE2sXZLsgP6+waGL9BTk2rAxkrAg90yBUYEFOVm/dBCGg1jm99RqEAmzIudFKq2AUqVVfs12F1QKhN5V2qSiwHIjYU19bq4Bit1ykisEyOBVSBdqynYOCqLby4HT4GajAtcD7K5613i5UOJG1CRW7khprrUBJObIGULOUHXF2oSGMrHFqMfY2T8UQr7q9Dy2VgTUPPTfdncWlnf0eDHCtgTXE/6X8z1oBZXUvaomq2dc01jtzu4rKag7/iByiXJrlR4F39uEG9KcQrNNaOR8qOfXOofyGHVptSRbMe8KANmmTI6skCw7WhBnZb7LmaGgN6AWrZ360BIbW8cUuiCRsjyTr0Dq22Atu0Ac3HFrHGs4dkZSL11GNrf5zGhwKjv5eKMbWAaGiITTvZvKj8wGHH9N6JuJpRmyNY7Aq0nEQf39sHVDk16qeNUSUZNOcGvsTNGxn8vJ5Vpnkv1ktODaZveXXU1tncrZFrPZsamv2D58+3p2nlK4/qialdjuVdGNSM9W9Ok7srLf72gn052xC6dtPJtPyxy0vibR1azjZ/141z6irI+NXiP7HaSPnVPsh0YvJ/eW03nl+m/h15+Hqqyq+3un7L36al6ij3+01+YpPGps/J1O/mtn924+z1dMTL87N45lG6/LzpG/2asbN9z8uO43pKa/uTb3Ntt5/Ih9OrBz/7qg/OaB/dOfblp6/mfFAsJAvYWsAAAAASUVORK5CYII=";
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":_pagenum,"token":token,"uuid":_id},
            url: init.ctxpath+"/voip/activeMemberList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.each(data.data,function(i,n){
                        (n.ico !== undefined && n.ico !== null && n.ico !== "") ? src= init.ctxpath+n.ico:src;
                        (n.consumePhone !== undefined ) ? phone= n.consumePhone:phone;
                        (n.memberCount !== undefined ) ? num= n.memberCount:num;
                        html+='<li class="clearfix participate-con">'+
                                '<div class="fl_l"><img  width="100%" src="'+src+'">'+ phone+'</div>'+
                                '<div class="fl_r">参与次数<i class="participate-num">'+ num+'</i></div>'+
                            '</li>';
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





}
var integral = new _integral();