
var indexBanner,contactBanner;//广告详情页面，图片浏览器的item

var _advert=function(){
    this.advertValue={
        "token":init.initValue.token,
        "pagenum":1,
        "flag":0
    }

    /*我的广告页面初始化*/
    this.advertReady=function(){
        advert.advertValue={
            "token":init.initValue.token,
            "pagenum":1,
            "flag":0
        };
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        $("#ico-select").on("click",function(){
            var arr = [ "全部", "提交审核","审核通过", "审核不通过"];
            init.initShowSelect(arr);
        })

        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),advert.showAdvertList,init.initValue);
        }).on("click",".list-con",function(){//跳转广告详情
            advert.goAdvertDetail($(this));
        })

        advert.showAdvertList(advert.advertValue);
        //滚动加载
        init.rollLoad(advert.advertValue,advert.showAdvertList);
        //输入搜索查询
        init.searchQuery(advert.advertInputNumber);
    }

    /*
    *  显示我的广告列表
    *  json
    *  tiken
    *  */
    this.showAdvertList=function(json){
        var discountType;
        json.flag === 1 ? discountType=1:( json.flag === 2 ? discountType=2:discountType );
        var _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token},
            url: init.ctxpath+"/voip/spCardadvertList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(json.filter,data.totalPage,data.totalCount);
                    advert.getAdvertList(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){
                $.toast("获取列表失败","text");
            }
        });
    }


    /*
    *  我的广告接口请求成功后
    *  data
    * */
    this.getAdvertList=function(data){
        var _class="",html="",src;
        $.each(data,function(i,n){
            if(n.state == 0){//0提交审核
                _class="submit";
            }else if(n.state == 1){//1审核通过
                _class="adopt";
            }else if(n.state == 2){//2审核不通过
                _class="not-audited";
            }
            n.src !== undefined ?src=n.src:src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAJFBMVEXX19f////h4eHr6+v19fXa2tr39/f9/f3m5ubx8fHt7e36+vp0YxfIAAABnUlEQVRo3u2XMUvDQBiGj9ZAdXutto0uURDBKcXBgouCi1sEOcTJDP0BzeLajG7tP9DB/+DP8654d0KI9+UOQeF7hgwJPDzHF447wTAMwzAMw3h5vPHw7hFM4WH464L0+EfWXsGu5zsLwgUv5W0WI7gHkBbhgmQBxVO4YAvD7AwH4YIjZELUKIIFmx94G3mw4Fq/HeA1XLCvHj1cxRX0I5bwlqqHxDJYcIdcJOvDrlM4EYYd7M0uMRHdBHJUuDlCkXcTJCXmwtBfAB+im0AC3xIezmeCKHABF5hH7AcSk95iVAQIbMBSnJqEpOgskHpoNqGuOghcgDAJA4wzusAF2IQaqOgCF2ASBkjLcUYW2ACbUGMlUZEFNsAkqACRqASqwATYhClW+lVFFZgAm6AChEmgCEyATdABJoEkcAF2ECaBJHABbhAmgSRwAc0EksAFNBMogskmoC2BIBjrgNYEggA6oD2BINAB7QkEgQ5oJuRfCWuPoGWNvefM7NRxp7SkjBQIGStIyv97UnWC6AvHn78zEa59DMMwDMMwjI9PrEZ/tIVZsTsAAAAASUVORK5CYII=";
            html+='<div class="list-con" id="'+ n.id+'">'+
                        '<div class="list-img">'+
                            '<img src="'+src+'" width="100%">'+
                            '<i class="list-img-title '+_class+'"></i>'+
                        '</div>'+
                        '<div>'+
                            '<p>批次：<span>'+ n.id+'</span></p>'+
                           // '<p>标题：<span>新品上线</span></p>'+
                            '<p>商家名称：<span>'+ n.advertiserName+'</span></p>'+
                        '</div>'+
                    '</div>';
        });
        $("#list").append(html);
        return ;
    }


    /*
     *  输入搜索广告批次，广告名称，广告标题查询
     *  */
    this.advertInputNumber=function(){
        var search=$.trim($("#search").val()),flag=true;
        if(search == ""){
            $.toast("请输入搜索的内容","text");
            flag=false;
        }else {
            advert.advertInputQuery(search);
        }
        return false;
    }

    /*
     *  查询广告
     *  search  输入的内容
     * */
    this.advertInputQuery=function(search){
        var  _sec=asciiSort({"limit":init.initValue.totalCount,"pagenum":1,"token":advert.initValue.token,"token":token,"search":search});
        $.ajax({
            type: "GET",
            data:{"limit":init.initValue.totalCount,"pagenum":1,"token":advert.initValue.token,"token":token,"search":search},
            url: init.ctxpath+"/voip/spCardadvertList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(1,data.totalPage);
                    if(data.totalCount==0){
                        $.toast("没有相匹配的数据","text");
                    }else {
                        advert.getAdvertList(data.data);
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
    *  跳转广告详情
    *  id
    * */
    this.goAdvertDetail=function(obj){
        var integralPagenum=Math.ceil((obj.index()+1)/10);//选中的活动所在的页数
        sessionStorage.setItem("integralPagenum",integralPagenum);
        sessionStorage.setItem("id",obj.attr("id"));//将选中的广告批次id存入本地
        window.location.href="advert-detail.html";
    }

    /*
    *  广告详情初始化
    * */
   this.advertDetailReady=function(){
       sessionStorage.removeItem("indexBannerUlr");
       sessionStorage.removeItem("contactBannerUlr");
       advert.advertValue={
           "token":init.initValue.token,
           "pagenum":1,
           "flag":0
       };
       init.initReady();
       advert.showAdvertDetail(init.initValue.token);
       advert.getAdvertDetailImage(advert.advertValue.token,sessionStorage.getItem("id"));//获取我的广告图片
       var swiper = new Swiper('#detail', {
           pagination: '.swiper-pagination',
           paginationClickable: true
       });
       //var indexBannerUlr=sessionStorage.getItem("indexBannerUlr").split(',');//字符串转数组
       //var contactBannerUlr=sessionStorage.getItem("contactBannerUlr").split(',');

       $(document).on("click",".index-banner .slide-item",function(){
           indexBanner.open($(this).index());
       }).on("click",".contact-banner .slide-item",function(){
           contactBanner.open($(this).index());
       })
   }

    /*
    *  获取广告详情
    * */
    this.showAdvertDetail=function(token){
        var _id=sessionStorage.getItem("id"),//选中的id
            _pagenum=sessionStorage.getItem("integralPagenum"),//当前页
            _sec=asciiSort({"limit":10,"pagenum":_pagenum,"token":token}),
            stateTxt,cardTxt;
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":_pagenum,"token":token},
            url: init.ctxpath+"/voip/spCardadvertList",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.each(data.data,function(i,n){
                        if(n.id == _id){
                            if(n.state == 0){
                                stateTxt="提交审核";
                            }else if(n.state == 1){
                                stateTxt="审核通过";
                            }else if(n.state == 2){
                                stateTxt="审核不通过";
                                $(".icon").show();
                            }
                            if(n.cardType ==1){
                                cardTxt="通用卡";
                            }else if(n.cardType == 0){
                                cardTxt="定制卡";
                            }
                            $("#id").text(n.id);
                            $("#phoneBookName").text(n.phoneBookName);
                            $("#phoneBookNumber").text(n.phoneBookNumber);
                            $("#cardType").text(cardTxt);
                            $("#cardCount").text(n.cardCount);
                            $("#activateCount").text(n.activateCount);
                            $("#advertstartnum").text(n.advertstartnum);
                            $("#advertendnum").text(n.advertendnum);
                            $("#auditDesc").text(n.auditDesc);
                            $(".state").text(stateTxt);
                            $(".advertiserName").text(n.advertiserName);
                            $("#agentShortName").text(n.agentShortName);
                        }
                    });
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){
                //("失败")
            }
        });
    }

    /*
    *  获取广告图片
    *  token
    *  cardAdvertId 广告批次
    * */
    this.getAdvertDetailImage=function(token,cardAdvertId){
        var _sec=asciiSort({"token":token,"cardAdvertId":cardAdvertId}),
            indexBannerHTML="",
            contactBannerHTML="",
            indexBannerUlr=[],
            contactBannerUlr=[];
        $.ajax({
            type: "GET",
            data:{"token":token,"cardAdvertId":cardAdvertId},
            url: init.ctxpath+"/voip/cardAdvertImgs",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    $.each(data.indexBanner,function(i,n){
                        indexBannerHTML+='<li class="slide-item"><img src="'+ n.imghref+'" width="100%"></li>';
                        indexBannerUlr.push(n.imghref);
                    });
                    $("#indexBanner").append(indexBannerHTML);
                    $.each(data.contactBanner,function(i,n){
                        contactBannerHTML+='<li class="slide-item"><img src="'+ n.imghref+'" width="100%"></li>';
                        contactBannerUlr.push(n.imghref);
                    });
                    $("#contactBanner").append(contactBannerHTML);
                    indexBanner = $.photoBrowser({
                        items: indexBannerUlr
                    });
                    contactBanner = $.photoBrowser({
                        items: contactBannerUlr
                    });
                    return indexBanner,contactBanner;
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }


}

var advert = new _advert();