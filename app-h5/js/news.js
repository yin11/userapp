var _news=function(){
    this.newsValue={
        "pagenum":1,
        
        "token":init.initValue.token,
        "shopName":init.initValue.shopName,
        "shopId":init.initValue.shopId
    }


    /*
    *  新闻列表页初始化
    *  */
    this.newsListReady=function(){
        news.newsValue={
            "pagenum":1,
            "token":init.initValue.token,
            "flag":0
        };
        //返回
        $(document).on("click","a.return",function(){
            goBackReturn();
        });
        $("#ico-select").on("click",function(){
            var arr = [ "全部","提交审核","审核通过","未通过审核"];
            init.initShowSelect(arr);
        });
        news.showNewsList(news.newsValue);
        $("body").on("click",".app-select li.item",function(){
            init.initScreenAlect($(this),news.showNewsList,news.newsValue);
        }).on("click",".news-con",function(){
            news.goNewsDetail($(this));
        });
        //滚动加载
        init.rollLoad(news.newsValue,news.showNewsList);
        //输入搜索查询
        init.searchQuery(news.newsInputNumber);

    }

    /*
     *  判断输入查询内容
     * */
    this.newsInputNumber=function(){
        var search=$.trim($("#search").val()),flag=true;
        if(search == ""){
            $.toast("请输入搜索的内容","text");
            flag=false;
        }else {
            news.newsInputQuery(search);
        }
        return false;
    }

    /*
     *  查询新闻推送列表
     *  token
     *  limit
     *  pagenum
     *  state  新闻状态：'状态 1审核通过 0提交审核 2审核不通过',
     *  title  标题
     *  remark  摘要
     *  search  输入的内容
     *  */
    this.newsInputQuery=function(search){
        $.ajax({
            type: "GET",
            data:{"limit":init.initValue.totalCount,"pagenum":1,"token":init.initValue.token,"title":search,"remark":search},
            url: init.ctxpath+"/voip/pushnews/list",
            dataType: "json",
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(1,data.totalPage);
                    if(data.totalCount==0){
                        $("#list").html("")
                        $.toast("没有相匹配的数据","text");
                        init.showBlankPage();
                    }else {
                        news.getNewsList(data.data);
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
    *  显示获取新闻列表页
    *  json
    *  token
    *  pagenum
    *  limit
    *  state
    * */
    this.showNewsList=function(json){
        var state;
        json.flag === 1 ? state=0:( json.flag === 2 ? state=1:(json.flag === 3 ?state=2:state));
        var _sec=asciiSort({"limit":10,"pagenum":json.pagenum,"token":json.token,"state":state});
        $.ajax({
            type: "GET",
            data:{"limit":10,"pagenum":json.pagenum,"token":json.token,"state":state},
            url: init.ctxpath+"/voip/pushnews/list",
            dataType: "json",
            headers:{"sec": md5(_sec)},
            success:function(data){
                if(data.state == 1){
                    init.getTotalPage(json.filter,data.totalPage,data.totalCount);
                    news.getNewsList(data.data);
                }else {
                    $.toast(data.msg,"text");
                }
            },
            error:function(){

            }
        });
    }

    /*
    *  请求新闻列表页成功后
    *  data 数据*/
    this.getNewsList=function(data){
        var _class="",html="",src,praiseCount="0",readCount="0";
        $.each(data,function(i,n){
            n.coverPhoto !== undefined ? src=n.coverPhoto : src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAJFBMVEXX19f////h4eHr6+v19fXa2tr39/f9/f3m5ubx8fHt7e36+vp0YxfIAAABnUlEQVRo3u2XMUvDQBiGj9ZAdXutto0uURDBKcXBgouCi1sEOcTJDP0BzeLajG7tP9DB/+DP8654d0KI9+UOQeF7hgwJPDzHF447wTAMwzAMw3h5vPHw7hFM4WH464L0+EfWXsGu5zsLwgUv5W0WI7gHkBbhgmQBxVO4YAvD7AwH4YIjZELUKIIFmx94G3mw4Fq/HeA1XLCvHj1cxRX0I5bwlqqHxDJYcIdcJOvDrlM4EYYd7M0uMRHdBHJUuDlCkXcTJCXmwtBfAB+im0AC3xIezmeCKHABF5hH7AcSk95iVAQIbMBSnJqEpOgskHpoNqGuOghcgDAJA4wzusAF2IQaqOgCF2ASBkjLcUYW2ACbUGMlUZEFNsAkqACRqASqwATYhClW+lVFFZgAm6AChEmgCEyATdABJoEkcAF2ECaBJHABbhAmgSRwAc0EksAFNBMogskmoC2BIBjrgNYEggA6oD2BINAB7QkEgQ5oJuRfCWuPoGWNvefM7NRxp7SkjBQIGStIyv97UnWC6AvHn78zEa59DMMwDMMwjI9PrEZ/tIVZsTsAAAAASUVORK5CYII=";
            n.praiseCount !== undefined ? praiseCount= n.praiseCount:praiseCount;
            n.readCount !== undefined ? readCount= n.readCount:readCount;
            html+='<div class="news-con" id="'+ n.id+'">'+
                    '<input type="hidden" value="'+ n.srcLink+'">'+
                    '<div class="news-con-top">'+
                        ' <div class="head"><img src="'+ src+'" width="100%"></div>'+
                        '<div class="content">'+
                            '<h3>'+ n.title+'</h3><p>'+n.remark+'</p>'+
                        '</div>'+
                    '</div>'+
                    '<p class="clearfix">'+
                        '<span class="fl_l">'+ slewTime(n.createTime)+'</span>'+
                        '<span class="fl_r"><i class="'+_class+'"></i></span>'+
                        '<span class="fl_r"><i class="ico-good"></i>'+ praiseCount+'</span>'+
                        '<span class="fl_r"><i class="ico-read"></i>'+ readCount+'</span>'+
                    '</p>'+
                '</div>';
        });
        $("#list").append(html);
        return ;
    }

    /*
     *  跳转新闻详情页 打开原文链接
     *  isSend  默认为ture，可发送
     * */
    this.goNewsDetail=function(obj){
        var _url=obj.find('input[type="hidden"]').val();
        window.location.href=_url+"?isSend=true";
    }

}
var news = new _news();