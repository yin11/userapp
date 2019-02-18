var _agent=function(){
    this.agentValue={
        "token":init.initValue.token,
        "pagenum":1,
        "limit":10,
        "flag":0,
        "filter":0,
        "shopName":init.initValue.shopName,
        "shopId":init.initValue.shopId,
    }


    /*
    *  我的代理商初始化
    * */
    this.agentReady=function(){
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        agent.agentValue={
            "token":init.initValue.token
        };
        //document.getElementById("query").onclick = function(){
        //    window.location.href="agent-query.html";
        //};
        document.getElementById("join").onclick = function(){
            window.location.href="join-agent.html";
        };
        //获取我的代理商信息
        agent.getAgentDetail(agent.agentValue);
    }


    /*
    *  获取我的代理商信息
    *  token
    * */
    this.getAgentDetail=function(json){
        $.ajax({
            type: "GET",
            data:json,
            url: init.ctxpath+"/voip/myAgent",
            dataType: "json",
            headers:{"sec": md5(asciiSort(json))},
            success:function(data){
                if(data.state == 1){
                    var agentData=data.data[0],txt1="",txt2="",txt3="";
                    (agentData.advertiserContacts !=="")? txt1=agentData.advertiserContacts:txt1="腾朝互联";
                    /*(agentData.advertiserContactPhone !=="")? txt1=agentData.advertiserContactPhone:txt1="腾朝互联";
                    (agentData.advertiserUnitAddress !=="")? txt1=agentData.advertiserUnitAddress:txt1="腾朝互联";*/
                    $("#advertiserContacts").text(txt1);
                    $("#advertiserContactPhone").text(agentData.advertiserContactPhone);
                    $("#advertiserUnitAddress").text(agentData.advertiserUnitAddress);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }



    /*
    *  代理商查询页面初始化
    * */
    this.agentQueryReady=function(){
        agent.agentValue={
            "token":init.initValue.token,
            "pagenum":1,
            "limit":10,
           // "filter":0,
        }
        //获取代理商列表
        agent.showAgentList(agent.agentValue);

        //页面滚动加载

    }


    /*
    *  显示代理商列表
    *  token
    *  pagenum
    *  limit
    * */
    this.showAgentList=function(josn){
        var _sec=asciiSort(josn),html="",src="";
        $.ajax({
            type: "GET",
            data:josn,
            url: init.ctxpath+"/voip/agentList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    //init.getTotalPage(json.filter,data.totalPage);
                    $.each(data.data,function(i,n){
                        (init.imgReg.test(n.ico))? src= n.ico: src=init.ctxpath+"/app-h5/img/agent-head.png";
                        html+='<div class="agent-con border-bottom">'+
                                '<div class="agent-head"><img src="'+src+'" width="100%"></div>'+
                                '<div>'+
                                    '<p>代理商简称：<i>'+ n.memberCount+'</i></p>'+
                                    '<p>真实姓名：<i>'+ n.nick+'</i></p>'+
                                    '<p>手机号码：<i>'+ n.consumePhone+'</i></p>'+
                                '</div>'+
                                '</div>';
                    })
                    $("#list").append(html);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){
                $.toast("请求失败","text");
            }
        });
    }


    /*
    *  新增代理商页面初始化
    * */
    this.addAgentReady=function(){
        init.initReady();
        $(".btn").on("click",function(){
            agent.subFormValidate();
        })
        $("#agentArea").cityPicker({
            title: "请选择代理地区"
        });
    };


    /*
    *  获取行业类型数据
    *  token
    *  dataType 默认1（0  获取大类数据', 1  获取大类下小类别数据）
    * */
    this.getAgentDataType=function(token){
        //("进入获取行业类型数据"+asciiSort({"token":token,"dataType":1})+"    ,   token="+token)
        var arr=[],itme={};
        $.ajax({
            type: "GET",
            data:{"token":token,"dataType":1},
            url: init.ctxpath+"/voip/categoryList",
            dataType: "json",
            headers:{"sec": md5(asciiSort({"token":token,"dataType":1}))},
            success:function(data){
                if(data.state == 1){
                    $.each(data.data,function(i,n){
                        itme={
                            title: n.name,
                            value: n.id
                        }
                        arr.push(itme);
                    })
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){

            }
        });
    }

    /*
    *  新增代理商表单验证
    * */
    this.subFormValidate=function(){
        var phoneReg=/^1[34578]\d{9}$/;
        var realName = $.trim($("#realName").val()),
            phone = $.trim($("#phone").val()),
            idAddress = $.trim($("#idAddress").val()),
            unitAddress = $.trim($("#unitAddress").val()),
            industry = $.trim($("#industry").val()),
            agentArea = $("#agentArea").attr("data-code");
        var flag = true;
        if(realName == ""){
            $.toast("请输入姓名", "text" );
            flag = false;
        }else if(phone == ""){
            $.toast("请输入手机号", "text" );
            flag = false;
        }else if(!phoneReg.test(phone)){
            $.toast("请输入正确格式的手机号", "text" );
            flag = false;
        }else if(idAddress == ""){
            $.toast("请输入住址", "text" );
            flag = false;
        }else if(unitAddress == ""){
            $.toast("请输入公司地址", "text" );
            flag = false;
        }/*else if(industry == ""){
            $.toast("请输入行业", "text" );
            flag = false;
        }*/else if(agentArea == "" || agentArea == undefined){
            $.toast("请选择代理地区", "text" );
            flag = false;
        }else {
            var gender=$(".gender input:checked").val(),
                regard= 0,dealTypeId="";
            ($("#regard").val() !== "") ? dealTypeId =$("#regard").val() :dealTypeId;
            //($("#industry").attr("data-values") !=="") ? dealTypeId =$("#industry").attr("data-values"): dealTypeId;
            var _value={
                "token" : init.initValue.token ,
                "realName" : realName,
                "gender" : gender,
                "idAddress" : idAddress ,
                "unitAddress" : unitAddress ,
                "agentArea" : parseInt(agentArea) ,
                "phone" : parseInt(phone) ,
                "regard" : regard ,
                "dealTypeId" : dealTypeId
            };
            agent.addAgent(_value);
        }
        return flag;
    }

    /*
    *  加盟代理商
    *  json
    *  token
    *  realName 代理商姓名
    *  gender  性别，默认0
    *  idAddress 家庭住址
    *  unitAddress  单位地址
    *  agentArea  代理区域
    *  phone  代理人电话
    *  regard     加盟缘由(非必须,Number,0)
    *  dealTypeId    行业类别(非必须,String)
    * */
    this.addAgent=function(json){
        //$("#regard").val(asciiSort(json)+"   ,    "+md5(asciiSort(json)));
        $.ajax({
            type: "POST",
            data:json,
            url: init.ctxpath+"/voip/insertIntegralactive",
            dataType: "json",
            headers:{"sec": md5(asciiSort(json))},
            success:function(data){
                if(data.state == 1){
                    $("申请已提交，等待审核","text");
                    $.toast(txt,"text");
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){
                $.toast("审核提交失败","text");
            }
        });
    }

    /*
    *  获取行业列表
    *  dataType
    *  token
    * */



}
var agent=new _agent();