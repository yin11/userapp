var _card=function(){
    /*
    * 卡统计页初始化
    * */
    this.cardStatisticsReady=function(){
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        $(".ico-card-usage").click(function(){
            window.location.href="card-usage.html";
        });
        $(".ico-card-purchase").click(function(){
            window.location.href="card-purchase.html";
        });
        //请求接口画图
        card.getCardChart(init.initValue.token);

    }


    /*
    *  卡统计页图表
    *  token
    * */
    this.getCardChart=function(token){
        var _sec=asciiSort({"token":token});
        $.ajax({
            type: "GET",
            data:{"token":token},
            url: init.ctxpath+"/voip/cardStatistics/total",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    //将开始卡号、结束卡号存入本地
                    /*sessionStorage.setItem("startNum",data.data.startNum);
                    sessionStorage.setItem("endNum",data.data.endNum);*/

                    var _active= (Number((data.data.actvaNum/data.data.totalCardNum)*100)).toFixed(2);
                    alert(JSON.stringify(data.data)+",比例"+_active);
                    $("#totalMoney").text(data.data.totalMoney);
                    $("#publicCardNum").text(data.data.publicCardNum);
                    $("#privateCardNum").text(data.data.privateCardNum);
                    (isNaN(_active)) ? _active=0 :_active;
                    var ringTxt="激活比例"+_active+"%",
                        ringDta=[
                            {"value":data.data.actvaNum, "name":'已激活'+_active+"%"},
                            {"value":(data.data.totalMoney-data.data.actvaNum), "name":'未激活'+(100-_active)+"%"}
                        ];

                    //饼图
                    var myChart = echarts.init(document.getElementById('ring-chart'));
                    var option1 =card.cardActiveRingChart(ringTxt,ringDta);
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option1);

                    //曲线图
                    var dataX=[],data1=[],data2=[],data3=[],data={};
                    alert(JSON.stringify(data.data.spCardList)+"曲线");
                    $.each(data.data.spCardList,function(i,n){
                        dataX.push(n.activeDateStr);
                        data1.push(n.activeDateStr);//总激活卡数
                        data1.push(n.activeDateStr);//总通用卡激活卡数
                        data1.push(n.activeDateStr);//总定制卡激活卡数
                    });
                    data[0]=data1;data[1]=data2;data[2]=data3;
                    alert("曲线图"+JSON.stringify(dataX)+","+JSON.stringify(data));
                    var myChart2 = echarts.init(document.getElementById('diagram'));
                    var option2 =card.cardActiveLineChart(dataX,data);
                    myChart2.setOption(option2);

                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){
                alert("请求失败")
            }
        });
    }


    /*
    *  卡购买记录列表页初始化
    * */
    this.cardPurchaseReady=function(){
        init.initReady();
        card.cardValue={
            "token":init.initValue.token,
            "pagenum":1
        };
        card.showCardPurchase(card.cardValue);
        //滚动加载
        init.rollLoad(card.cardValue,card.showCardPurchase);

        $(document).on("click",".purchase-list",function(){//进入卡购买详情
            card.getCardDetail($(this));
        })

    }


    /*
    * 显示购卡记录列表
    * json
    * token
    * pagenum
    * */
    this.showCardPurchase=function(json){
        var _sec=asciiSort({"token":json.token,"pagenum":json.pagenum,"limit":10});
        $.ajax({
            type: "GET",
            data:{"token":json.token,"pagenum":json.pagenum,"limit":10},
            url: init.ctxpath+"/voip/buyCardList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    card.getCardPurchase(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){

            }
        });
    }

    /*
    *  获取购卡记录列表
    *  data
    * */
    this.getCardPurchase=function(data){
        alert(JSON.stringify(data))
        var html="",_class="";
        $.each(data,function(i,n){
            if(n.cardType == 1){
                _class="custom";
            }else if(n.cardType == 2){
                _class="currency";
            }
            html+='<li class="purchase-list border-bottom '+_class+'" attr-type="'+ n.cardType+'">'+
                    '<input type="hidden" value="'+n.cardStartNum+','+ n.cardEndNum+'" class="cardNum">'+
                    '<div class="ico-bg"></div>'+
                        '<div>'+
                        '<p>代理商：<span class="agentName">'+ n.agentName+'</span></p>'+
                        '<p class="time">'+ n.createTimeStr+'</p>'+
                    '</div>'+
                    '<div class="number"><i class="cardCount">'+n.cardCount+'</i>张</div>'+
                '</li>';
        });
        $("#list").append(html);
    }

    /*
    *  点击获取购卡详情
    *  obj
    * */
    this.getCardDetail=function(obj){
        var _type=obj.attr("attr-type"),
            cardNum=obj.find(".cardNum").val(),
            _agentName=obj.find(".agentName").text(),
            _time=obj.find(".time").text(),
            _cardCount=obj.find(".cardCount").text();
        var search="?cardType="+_type+"&cardStartNum="+cardNum.split(",")[0]+"&cardEndNum="+cardNum.split(",")[1]+
                    "&agentName="+_agentName+"&createTimeStr="+_time+"&cardCount="+_cardCount;
        window.location.href = "purchase-detail.html"+search;
    }


    /*
    *  购卡详情初始化页面
    * */
    this.cardPurchaseDetail=function(){
        init.initReady();
        var data=parseQueryString(window.location.href),_class="";
        alert("进入购卡详情"+data.agentName+","+data.createTimeStr+","+data.cardStartNum+","+data.cardEndNum)
        if(data.cardType == 0){//通用卡
            _class="currency";
        }else if(data.cardType == 1){//定制卡
            _class="custom";
        }
        $("#agentName").text(decodeURI(data.agentName));
        $("#createTimeStr").text(decodeURI(data.createTimeStr));
        $("#cardStartNum").text(data.cardStartNum);
        $("#cardEndNum").text(data.cardEndNum);
        $("#cardCount").text(data.cardCount);
        $(".purchase-list").addClass(_class);

        //获取当前购卡激活比例
        card.cardPurchaseActivation(init.initValue.token,data.cardStartNum,data.cardEndNum);
    }

    /*
    *  购卡详情页获取当前购卡激活比例
    *  token
    *  cardStartNum   卡号开始号码
    *  cardEndNum     卡号结束号码
    * */
    this.cardPurchaseActivation=function(token,cardStartNum,cardEndNum){
        var _sec=asciiSort({"token":token,"cardStartNum":cardStartNum,"cardEndNum":cardEndNum});
        $.ajax({
            type: "GET",
            data:{"token":token,"cardStartNum":cardStartNum,"cardEndNum":cardEndNum},
            url: init.ctxpath+"/voip/cardStatisticsDetal",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    alert("进入环形图")
                    var _cardActive=data.data.cardActive,
                        _totalNum=data.data.totalNum;
                   // var _active=_cardActive/_totalNum;
                    var _active= (Number((data.data.cardActive/data.data.totalNum)*100)).toFixed(2);
                    (isNaN(_active)) ? _active=0 :_active;
                    var _text="激活比例"+_active+"%";
                    var _data=[
                        {"value":_cardActive, "name":'已激活'+_active+"%"},
                        {"value":_cardActive, "name":'未激活'+(100-_active)+"%"}
                    ];
                    var myChart = echarts.init(document.getElementById('ring-chart'));
                    var option=card.cardActiveRingChart(_text,_data);
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(a,b,c){

            }
        });
    }


    /*
    *  激活比例环形图    // 指定图表的配置项和数据
    *  txt  标题
    *  data  数据
    * */
    this.cardActiveRingChart=function(txt,data){
        var option = {
            backgroundColor:"#fff",
            title: {
                subtextStyle:{
                    fontSize:16
                },
                text:txt,//标题
                textStyle:{
                    fontSize:28
                },
                itemGap:-60,
                x: 'center',
                y: 'center'
            },
            tooltip: {
                show:false
            },
            color:['#0c8deb', '#e1e4ec'],
            legend: {
                itemWidth:0,
                selectedMode:false,
                x: 'center',
                y: '55%',
            },
            series: [
                {
                    type:'pie',
                    radius: ['75%', '80%'],
                    hoverAnimation:false,//关闭放大效果
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '10',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                }
            ]
        };
        return option;
    };

    /*
    *  激活比曲线图
    *  dataX
    *  dataY   Y轴的数据
    *  data
    * */
    this.cardActiveLineChart=function(dataX,data){
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['卡总量','通用卡','定制卡'],
                itemWidth:11
            },
            grid: {
                borderWidth:0,
                x: '0%', y: '8%', width: '100%', height: '70%',
                borderColor:"transparent"
            },
            color:['#9759ff', '#0c8deb',"#37f6d1"],//改变曲线颜色
            xAxis : [
                {
                    type: 'category',
                    boundaryGap: false,//这里表示是否补齐空白
                    data : dataX,
                    splitLine:{show: false},
                    axisTick:{show: false},
                    nameGap:0
                    //boundaryGap: ['0%', '0%']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    position:"right",
                    splitLine:{show: false},
                    axisTick:{show: false},
                    //data : dataY,
                    nameGap:-10,
                    zlevel:10,
                    axisLabel:{
                        formatter:function(v){
                            return (v/1000)+"k";
                        },
                        margin:-30
                    }
                }
            ],
            series : [
                {
                    name:'卡总量',
                    type:'line',
                    smooth:true,
                    symbol:"none",
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:date[0] //数组的形势
                },
                {
                    name:'通用卡',
                    type:'line',//平滑曲线
                    smooth:true,
                    symbol:"none",//去掉园点
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:date[1]
                },
                {
                    name:'定制卡',
                    type:'line',
                    smooth:true,
                    symbol:"none",
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:date[2]
                }
            ]
        };
        return option;
    }

    /*
    *  卡使用统计列表初始化
    * */
    this.cardUsageReady=function(){
        card.cardValue={
            "token":init.initValue.token,
           /* "startNum":sessionStorage.getItem("startNum"),
            "endNum":sessionStorage.getItem("endNum"),*/
            "pagenum":1,
            "flag":0,
            "filter":0
        };
        init.initReady();
        card.showCardUsageList(card.cardValue);
        $(document).on("click","#ico-select",function(){
            var arr = [ "全部", "通用卡", "定制卡"];
            init.initShowSelect(arr);
        })
        //滚动加载
        init.rollLoad(card.cardValue,card.showCardUsageList);

        //筛选
        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),card.showCardUsageList,card.cardValue);
        })

        //输入搜索查询
        init.searchQuery(card.cardInputNumber);

    }

    /*
     *  输入卡号，批次，使用人，金额查询卡使用统计列表
     *  */
    this.cardInputNumber=function(){
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
    *  显示卡使用统计列表
    *  token
    *  startNum  卡号开始号码（去除）
    *  endNum    卡号开始号码（去除）
    *  pagenum
    *  limit
    * */
    this.showCardUsageList=function(json){
        var  _sec=asciiSort({"limit":10,"token":json.token,"pagenum":json.pagenum});
        $.ajax({
            type: "GET",
            data:{"limit":10,"token":json.token,"pagenum":json.pagenum},
            url: init.ctxpath+"/voip/cardStatisticsDetal",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    card.getCardUsageList(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*
    *  获取卡统计使用列表
    * */
    this.getCardUsageList=function(data){
        var _class="",html="";
        $.each(data,function(i,n){
            if(n.cardType == 1){
                _class="custom";
            }else if(n.cardType == 0){
                _class="currency";
            }
            html+='<div class="usage-list border-bottom '+_class+'">'+
                    '<div class="ico-bg"></div>'+
                    '<div>'+
                        '<p>卡号：<span>'+ '</span></p>'+
                        '<p>批次：<span>'+ n.cardslotid +'</span></p>'+
                        '<p>使用人：<span>'+ n.phone+'</span></p>'+
                    '</div>'+
                    '<div class="number">￥'+ n.rechargemoney+'</div>'+
                    '</div>';
        });
        $("#list").append(html);
    }




}
var card=new _card();